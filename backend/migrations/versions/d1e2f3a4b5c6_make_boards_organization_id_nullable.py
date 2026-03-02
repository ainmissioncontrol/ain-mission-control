"""Make boards.organization_id nullable for default org support.

Revision ID: d1e2f3a4b5c6
Revises: b308f2876359
Create Date: 2026-03-01 14:08:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "d1e2f3a4b5c6"
down_revision = "b308f2876359"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Make organization_id nullable in boards table."""
    op.alter_column(
        "boards",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=True,
        existing_nullable=False,
    )


def downgrade() -> None:
    """Revert to non-nullable organization_id."""
    op.alter_column(
        "boards",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=False,
        existing_nullable=True,
    )
