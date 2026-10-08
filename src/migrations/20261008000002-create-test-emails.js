'use strict';

const dayjs = require('dayjs');

const enums = require('../enums');
const dateTimeFormatConfig = require('../config/datetimeFormat');

const NAME_PREFIX = '[Test] ';

// Builds an email editor (Unlayer) design with one row and one text block per paragraph, so
// the template opens in the email builder ready to edit.
function buildDesign(paragraphs) {
  const linkStyle = {
    inherit: true,
    linkColor: '#0000ee',
    linkHoverColor: '#0000ee',
    linkUnderline: true,
    linkHoverUnderline: true,
  };
  const editable = {
    selectable: true,
    draggable: true,
    duplicatable: true,
    deletable: true,
    hideable: true,
  };

  const rows = paragraphs.map((text, index) => {
    const n = index + 1;
    return {
      id: `row-${n}`,
      cells: [1],
      columns: [
        {
          id: `column-${n}`,
          contents: [
            {
              id: `text-${n}`,
              type: 'text',
              values: {
                containerPadding: '10px 20px',
                anchor: '',
                fontSize: '14px',
                textAlign: 'left',
                lineHeight: '140%',
                linkStyle,
                hideDesktop: false,
                displayCondition: null,
                _meta: { htmlID: `u_content_text_${n}`, htmlClassNames: 'u_content_text' },
                ...editable,
                text: `<p style="line-height: 140%;">${text}</p>`,
              },
            },
          ],
          values: {
            backgroundColor: '',
            padding: '0px',
            border: {},
            borderRadius: '0px',
            _meta: { htmlID: `u_column_${n}`, htmlClassNames: 'u_column' },
          },
        },
      ],
      values: {
        displayCondition: null,
        columns: false,
        backgroundColor: '',
        columnsBackgroundColor: '#ffffff',
        backgroundImage: {
          url: '',
          fullWidth: true,
          repeat: 'no-repeat',
          size: 'custom',
          position: 'center',
        },
        padding: '0px',
        anchor: '',
        hideDesktop: false,
        _meta: { htmlID: `u_row_${n}`, htmlClassNames: 'u_row' },
        ...editable,
      },
    };
  });

  return {
    counters: {
      u_row: paragraphs.length,
      u_column: paragraphs.length,
      u_content_text: paragraphs.length,
    },
    body: {
      id: 'body',
      rows,
      headers: [],
      footers: [],
      values: {
        contentWidth: '600px',
        contentAlign: 'center',
        fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
        textColor: '#000000',
        backgroundColor: '#F7F8F9',
        backgroundImage: {
          url: '',
          fullWidth: true,
          repeat: 'no-repeat',
          size: 'custom',
          position: 'center',
        },
        preheaderText: '',
        linkStyle: {
          body: true,
          linkColor: '#0000ee',
          linkHoverColor: '#0000ee',
          linkUnderline: true,
          linkHoverUnderline: true,
        },
        _meta: { htmlID: 'u_body', htmlClassNames: 'u_body' },
      },
    },
    schemaVersion: 16,
  };
}

// HTML used for the list preview until the template is saved again from the builder, which
// replaces it with the editor's own export.
function buildHtml(paragraphs) {
  const content = paragraphs
    .map(text => `<p style="margin: 0; padding: 10px 20px; line-height: 140%;">${text}</p>`)
    .join('');

  return (
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
    '<body style="margin: 0; background-color: #F7F8F9; font-family: arial, helvetica, sans-serif;">' +
    `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">${content}</div>` +
    '</body></html>'
  );
}

function testEmails() {
  const tomorrow = dayjs().add(1, 'day').hour(8).minute(0).second(0);
  const format = time => time.format(dateTimeFormatConfig.datetime.value);

  return [
    {
      name: `${NAME_PREFIX}Welcome New User`,
      description: 'Sent to new users with their account details.',
      to: '{{email}}',
      subject: 'Welcome to ZApp, {{name}}!',
      paragraphs: [
        '<strong>Hi {{name}},</strong>',
        'Your ZApp account is ready. You can sign in with <strong>{{email}}</strong>.',
        'Your role: {{role}}.',
        'Regards,<br />The ZApp Team',
      ],
      useScheduler: false,
      cc: ['support@zapp.com'],
      bcc: [],
      dataSources: [
        {
          name: 'user',
          query:
            'SELECT u."name", u."email", r."label" AS "role_name" FROM "users" u ' +
            'JOIN "roles" r ON r."id" = u."roleId"',
          emailDataSourceTypeId: enums.emailDataSourceType.primary,
        },
      ],
      tags: [
        { label: 'name', value: 'user.name', defaultValue: 'there' },
        { label: 'email', value: 'user.email', defaultValue: null },
        { label: 'role', value: 'user.role_name', defaultValue: 'User' },
      ],
      scheduler: null,
      settings: {
        openTracking: true,
        clickTracking: false,
        unsubscribeLink: false,
        emailPriorityLevelId: enums.emailPriorityLevel.normal,
      },
      attachments: [],
    },
    {
      name: `${NAME_PREFIX}Monthly Role Report`,
      description: 'Monthly summary of users per role for the administrators.',
      to: 'admin@zapp.com',
      subject: 'Monthly role report',
      paragraphs: [
        '<strong>Monthly Role Report</strong>',
        'Total users: <strong>{{total_users}}</strong>.',
        'Total roles: <strong>{{total_roles}}</strong>.',
        'This report is sent automatically on the first day of every month.',
      ],
      useScheduler: true,
      cc: ['manager@zapp.com'],
      bcc: ['audit@zapp.com', 'archive@zapp.com'],
      dataSources: [
        {
          name: 'summary',
          query: 'SELECT COUNT(*) AS "total_users" FROM "users"',
          emailDataSourceTypeId: enums.emailDataSourceType.primary,
        },
        {
          name: 'roles',
          query: 'SELECT COUNT(*) AS "total_roles" FROM "roles"',
          emailDataSourceTypeId: enums.emailDataSourceType.optional,
        },
      ],
      tags: [
        { label: 'total_users', value: 'summary.total_users', defaultValue: '0' },
        { label: 'total_roles', value: 'roles.total_roles', defaultValue: '0' },
      ],
      scheduler: {
        startTime: format(tomorrow.date(1).add(1, 'month')),
        endTime: format(tomorrow.date(1).add(1, 'year')),
        emailSchedulerTypeId: enums.emailSchedulerType.month,
      },
      settings: {
        openTracking: true,
        clickTracking: true,
        unsubscribeLink: false,
        emailPriorityLevelId: enums.emailPriorityLevel.high,
      },
      attachments: [
        {
          fileName: 'report-notes.txt',
          mimeType: 'text/plain',
          content: 'Monthly role report\n\nThis attachment was added by the test data migration.\n',
        },
      ],
    },
    {
      name: `${NAME_PREFIX}Maintenance Notice`,
      description: 'Static announcement without data sources.',
      to: 'all-users@zapp.com',
      subject: 'Scheduled maintenance this weekend',
      paragraphs: [
        '<strong>Scheduled maintenance</strong>',
        'ZApp will be unavailable on Saturday from 22:00 to 23:59 while we upgrade our servers.',
        'Thank you for your patience.',
      ],
      useScheduler: true,
      cc: [],
      bcc: [],
      dataSources: [],
      tags: [],
      scheduler: {
        startTime: format(tomorrow),
        endTime: format(tomorrow.add(7, 'day')),
        emailSchedulerTypeId: enums.emailSchedulerType.days,
      },
      settings: {
        openTracking: false,
        clickTracking: false,
        unsubscribeLink: true,
        emailPriorityLevelId: enums.emailPriorityLevel.low,
      },
      attachments: [
        {
          fileName: 'maintenance-schedule.csv',
          mimeType: 'text/csv',
          content: 'date,start,end\nSaturday,22:00,23:59\n',
        },
      ],
    },
  ];
}

/**
 * Adds a few email templates for testing the email builder: one per main use case (merge tags
 * from a primary source, a scheduled report with optional sources and attachments, and a
 * static notice). Templates that already exist by name are left as they are.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    const timestamps = { createdAt: now, updatedAt: now };

    await sequelize.transaction(async transaction => {
      const bulkInsert = (table, rows) =>
        rows.length ? queryInterface.bulkInsert(table, rows, { transaction }) : null;

      for (const email of testEmails()) {
        const [existing] = await sequelize.query('SELECT "id" FROM "emails" WHERE "name" = ?', {
          replacements: [email.name],
          transaction,
          type: sequelize.QueryTypes.SELECT,
        });
        if (existing) continue;

        const [[{ id: emailId }]] = await sequelize.query(
          `INSERT INTO "emails"
             ("name", "description", "to", "subject", "body", "design", "useScheduler",
              "createdAt", "updatedAt")
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING "id"`,
          {
            replacements: [
              email.name,
              email.description,
              email.to,
              email.subject,
              buildHtml(email.paragraphs),
              JSON.stringify(buildDesign(email.paragraphs)),
              email.useScheduler,
              now,
              now,
            ],
            transaction,
          },
        );

        await bulkInsert(
          'emailCC',
          email.cc.map(label => ({ label, emailId, ...timestamps })),
        );
        await bulkInsert(
          'emailBCC',
          email.bcc.map(label => ({ label, emailId, ...timestamps })),
        );
        await bulkInsert(
          'emailDataSources',
          email.dataSources.map(source => ({ ...source, emailId, ...timestamps })),
        );
        await bulkInsert(
          'emailTags',
          email.tags.map(tag => ({ ...tag, emailId, ...timestamps })),
        );
        if (email.scheduler) {
          await bulkInsert('emailSchedulers', [{ ...email.scheduler, emailId, ...timestamps }]);
        }
        await bulkInsert('emailSettings', [{ ...email.settings, emailId, ...timestamps }]);
        await bulkInsert(
          'emailAttachments',
          email.attachments.map(attachment => {
            const fileBuffer = Buffer.from(attachment.content, 'utf8');
            return {
              fileName: attachment.fileName,
              mimeType: attachment.mimeType,
              fileSize: fileBuffer.length,
              fileBuffer,
              emailId,
              ...timestamps,
            };
          }),
        );
      }
    });
  },

  // Child rows are removed by the ON DELETE CASCADE foreign keys on "emails".
  async down(queryInterface) {
    await queryInterface.bulkDelete('emails', {
      name: testEmails().map(email => email.name),
    });
  },
};
