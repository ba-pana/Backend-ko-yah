import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BrandService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBrand(brand_name: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO brand (brand_name) VALUES (?)',
      [brand_name],
    );
    return { id: result.insertId, brand_name: brand_name };
  }

  async findByBrand(brand_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM brand WHERE brand_name = ?',
      [brand_name],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM brand WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM brand',
    );
    return rows;
  }

  async updateBrand(id: number, partial: { brand_name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.brand_name) {
      fields.push('brand_name = ?');
      values.push(partial.brand_name);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE brand SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteBrand(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM brand WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }
}
