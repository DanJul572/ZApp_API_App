'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    await queryInterface.bulkInsert(
      'scripts',
      [
        {
          label: 'One Menu Per Role',
          sql: `
                        DO $$
                            BEGIN IF EXISTS (
                                SELECT 1 FROM "menus"
                                WHERE "roleId" = @currentRoleId@
                            )
                            THEN RAISE EXCEPTION '400:Menu for this Role is alreasy exist';
                            END IF;
                        END $$;
                    `,
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Validate Role access',
          sql: `
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1
                                FROM "access"
                                WHERE "roleId" = @currentRoleId@ AND "viewId" = @rowId@
                            ) THEN
                                RAISE EXCEPTION '400:Role ID % does not have access to View (EDIT) ID %', @currentRoleId@, @rowId@;
                            END IF;
                        END;
                        $$;
                    `,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('scripts', null, {});
  },
};
