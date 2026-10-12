import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createUser(username: string, password: string, role = 'User') {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashed, role],
    );
    return { users_id: result.insertId, username, role };
  }

  async findByUsername(username: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT users_id, username, password, role, refresh_token FROM users WHERE username = ?',
      [username],
    );
    return rows[0];
  }

  async findById(users_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT users_id, username, role FROM users WHERE users_id = ?',
      [users_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT users_id, username, role, created_at FROM users',
    );
    return rows;
  }

  async updateUser(users_id: number, partial: { username?: string; password?: string; role?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.username) {
      fields.push('username = ?');
      values.push(partial.username);
    }

    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(users_id);

    values.push(users_id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE users_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(users_id);
  }

  async deleteUser(users_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM users WHERE users_id = ?',
      [users_id],
    );
    return result.affectedRows > 0;
  }

  async setRefreshToken(users_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE users SET refresh_token = ? WHERE users_id = ?',
      [refreshToken, users_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT users_id, username, role, refresh_token FROM users WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}