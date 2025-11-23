const db = require('../config/db');

async function createLink({ code, url }) {
    const result = await db.query(
        `INSERT INTO links (code, url)
     VALUES ($1, $2)
     RETURNING *`,
        [code, url]
    );
    return result.rows[0];
}

async function findLinkByCode(code) {
    const result = await db.query(
        `SELECT * FROM links WHERE code = $1`,
        [code]
    );
    return result.rows[0];
}


async function listLinks() {
    const result = await db.query(
        `SELECT * FROM links ORDER BY created_at DESC`
    );
    return result.rows;
}


async function incrementClick(code) {
    const res = await db.query(
        `UPDATE links
       SET clicks = clicks + 1,
           last_clicked = NOW() AT TIME ZONE 'Asia/Kolkata'
     WHERE code = $1
     RETURNING *`,
        [code]
    );
    return res.rows[0];
}


async function deleteLinkByCode(code) {
    const result = await db.query(
        `DELETE FROM links
     WHERE code = $1
     RETURNING *`,
        [code]
    );
    return result.rows[0];
}

module.exports = {
    createLink,
    findLinkByCode,
    listLinks,
    incrementClick,
    deleteLinkByCode
};
