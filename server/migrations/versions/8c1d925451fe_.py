"""empty message

Revision ID: 8c1d925451fe
Revises: 690e8766e4ac
Create Date: 2020-02-22 23:22:28.934557

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8c1d925451fe'
down_revision = '690e8766e4ac'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('urine_test',
    sa.Column('Id', sa.String(length=50), nullable=False),
    sa.Column('urineTestLeuc', sa.String(length=5), nullable=True),
    sa.Column('urineTestNit', sa.String(length=5), nullable=True),
    sa.Column('urineTestGlu', sa.String(length=5), nullable=True),
    sa.Column('urineTestPro', sa.String(length=5), nullable=True),
    sa.Column('urineTestBlood', sa.String(length=5), nullable=True),
    sa.Column('readingId', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['readingId'], ['reading.readingId'], ),
    sa.PrimaryKeyConstraint('Id')
    )
    op.drop_column('reading', 'urineTestNit')
    op.drop_column('reading', 'urineTestBlood')
    op.drop_column('reading', 'urineTestLeuc')
    op.drop_column('reading', 'urineTestPro')
    op.drop_column('reading', 'urineTestGlu')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('reading', sa.Column('urineTestGlu', mysql.VARCHAR(length=5), nullable=True))
    op.add_column('reading', sa.Column('urineTestPro', mysql.VARCHAR(length=5), nullable=True))
    op.add_column('reading', sa.Column('urineTestLeuc', mysql.VARCHAR(length=5), nullable=True))
    op.add_column('reading', sa.Column('urineTestBlood', mysql.VARCHAR(length=5), nullable=True))
    op.add_column('reading', sa.Column('urineTestNit', mysql.VARCHAR(length=5), nullable=True))
    op.drop_table('urine_test')
    # ### end Alembic commands ###
