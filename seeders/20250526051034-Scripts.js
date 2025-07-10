'use strict';

const dayjs = require('dayjs');

const datetimeFormat = require('../constats/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(datetimeFormat.datetime.value);
    await queryInterface.bulkInsert(
      'Scripts',
      [
        {
          label: 'One Menu Per Role',
          sql: `
                        DO $$
                            BEGIN IF EXISTS (
                                SELECT 1 FROM "Menus"
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
          label: 'Validate Role Access',
          sql: `
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1
                                FROM "Access"
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
    await queryInterface.bulkDelete('Scripts', null, {});
  },
};
