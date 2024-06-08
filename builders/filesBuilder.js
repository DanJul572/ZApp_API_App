module.exports = {
    save(files) {
        let query = 'INSERT INTO "Files" ("name", "data") VALUES ';
        const values = [];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const fileBuffer = Buffer.from(file.buffer, 'base64');
            const filename = file.originalname;

            query += `($${index * 2 + 1}, $${index * 2 + 2})`;
            if (index + 1 < files.length) {
                query += ', ';
            }

            values.push(filename);
            values.push(fileBuffer);
        }

        return {query, values};
    },

    download() {
        return 'SELECT "data" from "Files" WHERE "name" = $1';
    },
};
