"""Database session management with timeout protection."""

import asyncio
from asyncio import timeout as async_timeout
from contextlib import asynccontextmanager
from pathlib import Path
from typing import TYPE_CHECKING, AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.core.config import settings
from app.core.logging import get_logger

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncEngine

logger = get_logger(__name__)

# Create async engine with connection pooling
async_engine: AsyncEngine = create_async_engine(
    settings.database_url,
    echo=settings.environment == "dev",
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    connect_args={"timeout": 10, "server_settings": {}},
)

async_session_maker = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


def run_migrations() -> None:
    """Run pending Alembic migrations synchronously."""
    from alembic.config import Config
    from alembic.command import upgrade

    alembic_cfg = Config(Path(__file__).resolve().parents[2] / "alembic.ini")
    upgrade(alembic_cfg, "head")


async def init_db() -> None:
    """Initialize database schema with timeout protection."""
    try:
        # Set 30-second timeout for DB initialization
        async with async_timeout(30):
            if settings.db_auto_migrate:
                versions_dir = Path(__file__).resolve().parents[2] / "migrations" / "versions"
                if any(versions_dir.glob("*.py")):
                    logger.info("Running migrations on startup")
                    await asyncio.to_thread(run_migrations)
                    return
                logger.warning("No migration revisions found; falling back to create_all")

            async with async_engine.connect() as conn, conn.begin():
                await conn.run_sync(SQLModel.metadata.create_all)
    except asyncio.TimeoutError:
        logger.error("Database initialization timed out after 30 seconds")
        raise
    except Exception as e:
        logger.error(f"Database initialization failed: {e}", exc_info=True)
        raise


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a request-scoped async DB session with safe rollback on errors."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.rollback()


@asynccontextmanager
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Context manager for explicit session control outside request handlers."""
    session = async_session_maker()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
