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
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("loan_applications")
    }

    # submitted_at
    if "submitted_at" not in columns:
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

    # reviewed_at
    if "reviewed_at" not in columns:
        op.add_column(
            "loan_applications",
            sa.Column(
                "reviewed_at",
                sa.DateTime(timezone=True),
                nullable=True,
            ),
        )

    # reviewed_by
    if "reviewed_by" not in columns:
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
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("loan_applications")
    }

    if "reviewed_by" in columns:
        foreign_keys = inspector.get_foreign_keys("loan_applications")

        for fk in foreign_keys:
            if fk.get("constrained_columns") == ["reviewed_by"]:
                if fk.get("name"):
                    op.drop_constraint(
                        fk["name"],
                        "loan_applications",
                        type_="foreignkey",
                    )

        op.drop_column(
            "loan_applications",
            "reviewed_by",
        )

    if "reviewed_at" in columns:
        op.drop_column(
            "loan_applications",
            "reviewed_at",
        )

    if "submitted_at" in columns:
        op.drop_column(
            "loan_applications",
            "submitted_at",
        )
