import { Injectable } from "@nestjs/common";
import knex, { Knex } from "knex";
import * as knexConfig from "../../knexfile";

@Injectable()
export class DatabaseService {
  private readonly knex: Knex;

  constructor() {
    this.knex = knex(knexConfig.development);
  }

  getKnex(): Knex {
    return this.knex;
  }
}
