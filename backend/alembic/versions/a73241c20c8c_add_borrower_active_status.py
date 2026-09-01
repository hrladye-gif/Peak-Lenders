"""add borrower active status

Revision ID: a73241c20c8c
Revises: 88f0052be5e8
Create Date: 2026-09-01
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a73241c20c8c"
down_revision: Union[str, Sequence[str], None] = "88f0052be5e8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "borrowers",
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )


def downgrade() -> None:
    op.drop_column("borrowers", "is_active")
