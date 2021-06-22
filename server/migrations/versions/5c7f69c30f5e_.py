"""add allergy field to patient

Revision ID: 5c7f69c30f5e
Revises: b744b32f117e
Create Date: 2021-06-14 07:04:40.033591

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "5c7f69c30f5e"
down_revision = "b744b32f117e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("patient", sa.Column("allergy", sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("patient", "allergy")
    # ### end Alembic commands ###
