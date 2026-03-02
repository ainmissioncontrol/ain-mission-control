"""Make tags.organization_id nullable for global tag support.

Revision ID: d2e3f4a5b6c7
Revises: d1e2f3a4b5c6
Create Date: 2026-03-01 19:04:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "d2e3f4a5b6c7"
down_revision = "d1e2f3a4b5c6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Make organization_id nullable in tags table."""
    op.alter_column(
        "tags",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=True,
        existing_nullable=False,
    )


def downgrade() -> None:
    """Revert to non-nullable organization_id."""
    op.alter_column(
        "tags",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=False,
        existing_nullable=True,
    )
