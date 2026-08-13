"""repair loan application timestamps

Revision ID: 2236f9325153
Revises: a9e7bdbfb90c
Create Date: 2026-08-13
"""

from alembic import op
import sqlalchemy as sa


revision = "2236f9325153"
down_revision = "a9e7bdbfb90c"
branch_labels = None
depends_on = None


def upgrade():
    # Existing database uses date_submitted.
    # Add the columns expected by the SQLAlchemy model without
    # deleting or recreating the loan_applications table.

    op.add_column(
        "loan_applications",
        sa.Column(
            "submitted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE loan_applications
        SET submitted_at = date_submitted::timestamp
        WHERE submitted_at IS NULL
        """
    )

    op.alter_column(
        "loan_applications",
        "submitted_at",
        nullable=False,
    )

    op.add_column(
        "loan_applications",
        sa.Column(
            "reviewed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.add_column(
        "loan_applications",
        sa.Column(
            "reviewed_by",
            sa.String(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_constraint(
        "loan_applications_reviewed_by_fkey",
        "loan_applications",
        type_="foreignkey",
    )

    op.drop_column(
        "loan_applications",
        "reviewed_by",
    )

    op.drop_column(
        "loan_applications",
        "reviewed_at",
    )

    op.drop_column(
        "loan_applications",
        "submitted_at",
    )
