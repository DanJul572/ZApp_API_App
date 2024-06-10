module.exports = {
    save(files) {
        let query = 'INSERT INTO "Files" ("name", "data", "type", "encoding", "size") VALUES ';

        const values = [];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];

            const fileBuffer = Buffer.from(file.buffer, 'base64');

            const filename = file.originalname;
            const mimetype = file.mimetype;
            const encoding = file.encoding;
            const size = file.size;

            query += `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`;

            if (index + 1 < files.length) {
                query += ', ';
            }

            values.push(filename);
            values.push(fileBuffer);
            values.push(mimetype);
            values.push(encoding);
            values.push(size);
        }

        // Return query and values array
        return {query, values};
    },

    delete(files) {
        let query = 'DELETE FROM "Files" WHERE "name" IN (';
        for (let index = 0; index < files.length; index++) {
            query += `$${index + 1}`;
            if (index + 1 < files.length) {
                query += ', ';
            }
        }
        query += ')';
        return query;
    },

    download() {
        return 'SELECT "id", "name", "data", "type", "encoding", "size" from "Files" WHERE "name" = $1';
    },
};
