"""align loan application schema with model

Revision ID: c9cb7e7d8ca7
Revises: 4e20eeaf21b9
Create Date: 2026-09-02
"""

from alembic import op
import sqlalchemy as sa


revision = "c9cb7e7d8ca7"
down_revision = "4e20eeaf21b9"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        "loan_applications",
        "purpose",
        existing_type=sa.Text(),
        type_=sa.String(),
        existing_nullable=True,
    )

    op.drop_column(
        "loan_applications",
        "date_submitted",
    )


def downgrade():
    op.add_column(
        "loan_applications",
        sa.Column(
            "date_submitted",
            sa.Date(),
            nullable=True,
        ),
    )

    op.alter_column(
        "loan_applications",
        "purpose",
        existing_type=sa.String(),
        type_=sa.Text(),
        existing_nullable=True,
    )
