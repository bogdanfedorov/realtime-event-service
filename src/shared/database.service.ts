import { Injectable } from "@nestjs/common";
import knex, { Knex } from "knex";
import * as config from "../../knexfile";

@Injectable()
export class DatabaseService {
  private readonly knexInstance: Knex;

  constructor() {
    this.knexInstance = knex(config[process.env.NODE_ENV || "development"]);
  }

  getKnex(): Knex {
    return this.knexInstance;
  }
}
