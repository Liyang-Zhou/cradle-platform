"""dob_only_remove_age

Revision ID: 3a4b8033a6d9
Revises: a1913287ffaf
Create Date: 2020-07-24 04:19:09.606360

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '3a4b8033a6d9'
down_revision = 'eb105ee6775b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('patient', sa.Column('isExactDob', sa.Boolean(), nullable=True))
    op.drop_column('patient', 'patientAge')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('patient', sa.Column('patientAge', mysql.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('patient', 'isExactDob')
    
    # ### end Alembic commands ###
