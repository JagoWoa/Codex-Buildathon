import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function runMigration() {
  const password = process.argv[2] || process.env.SUPABASE_DB_PASSWORD;
  
  if (!password) {
    console.error('\x1b[31mError: Debes proporcionar la contraseña de la base de datos de Supabase.\x1b[0m');
    console.error('Uso: node migrate.js <tu_contraseña_supabase>');
    console.error('O define la variable de entorno: export SUPABASE_DB_PASSWORD=<tu_contraseña_supabase>');
    process.exit(1);
  }

  const projectRef = 'ckvbubwbaouxobqmfvum';
  const host = 'aws-0-ca-central-1.pooler.supabase.com';
  const username = `postgres.${projectRef}`;
  const connectionString = `postgresql://${username}:${encodeURIComponent(password)}@${host}:6543/postgres`;
  
  console.log(`Intentando conectar a la base de datos de Supabase vía Pooler IPv4 (${host}:6543)...`);
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\x1b[32mConexión a PostgreSQL establecida con éxito.\x1b[0m');

    const sqlPath = path.join(process.cwd(), 'supabase-setup.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encontró el archivo SQL en: ${sqlPath}`);
    }

    console.log('Leyendo archivo supabase-setup.sql...');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Ejecutando script de migración y seed en Supabase...');
    await client.query(sql);

    console.log('\x1b[32m¡Migración y datos de ejemplo creados con éxito en Supabase!\x1b[0m');
  } catch (error) {
    console.error('\x1b[31mOcurrió un error al ejecutar la migración:\x1b[0m', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
