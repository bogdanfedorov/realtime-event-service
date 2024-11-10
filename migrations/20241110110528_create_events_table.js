/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("events", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.timestamp("start_time").notNullable();
    table.timestamp("end_time");
    table.jsonb("data");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("events");
};
