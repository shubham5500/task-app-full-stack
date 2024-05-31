/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('board_members', {
    id: "id",
    user_id: {
      type: "integer",
      references: "users(id)",
      notNull: true,
      onDelete: "CASCADE",
    },
    board_id: {
      type: "integer",
      references: "boards(id)",
      notNull: true,
      onDelete: "CASCADE",
    },
    role: {
      type: "string",
      default: "member",
    },
    added_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint('board_members', 'unique_user_board', {
    unique: ['user_id', 'board_id']
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('board_members')
};
