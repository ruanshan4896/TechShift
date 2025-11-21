import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function addStatusColumn() {
  try {
    console.log('Adding status column to articles table...\n');

    // Add status column if not exists
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'articles' AND column_name = 'status'
        ) THEN
          ALTER TABLE articles 
          ADD COLUMN status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'PUBLISHED';
          
          RAISE NOTICE 'Column status added successfully';
        ELSE
          RAISE NOTICE 'Column status already exists';
        END IF;
      END $$;
    `;

    console.log('✓ Migration completed successfully!');
    console.log('\nVerifying column...');

    // Verify the column exists
    const result = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'articles' AND column_name = 'status'
    `;

    if (result.length > 0) {
      console.log('✓ Status column verified:');
      console.log('  Column:', result[0].column_name);
      console.log('  Type:', result[0].data_type);
      console.log('  Default:', result[0].column_default);
    } else {
      console.log('✗ Status column not found!');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addStatusColumn();
