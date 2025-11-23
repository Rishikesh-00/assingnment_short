const {
    createLink,
    findLinkByCode,
    listLinks,
    incrementClick,
    deleteLinkByCode
} = require('../modals/linkModal');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

function isValidCode(code) {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}


async function createLinkHandler(req, res) {
    try {
        const { url, code } = req.body;

        if (!url) {
            return res.status(400).json({ message: 'url is required' });
        }


        try {
            new URL(url);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid URL' });
        }

        let finalCode = code;

        if (finalCode) {
            if (!isValidCode(finalCode)) {
                return res.status(400).json({
                    message:
                        'Custom alias must be 6–8 characters long and contain only letters or numbers (e.g., abc123, mylink01)'
                });
            }
            const existing = await findLinkByCode(finalCode);
            if (existing) {
                return res.status(409).json({ message: 'Code already exists' });
            }
        } else {
            const gen = () => Math.random().toString(36).slice(2, 8);
            let tries = 0;
            do {
                finalCode = gen();
                tries++;
                if (tries > 20) break;
            } while (await findLinkByCode(finalCode));
        }

        const link = await createLink({ code: finalCode, url });

        const shortUrl = `${BASE_URL.replace(/\/$/, '')}/${link.code}`;

        res.status(201).json({
            ...link,
            shortUrl
        });

    } catch (err) {
        console.error('createLinkHandler error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


async function listLinksHandler(req, res) {
    try {
        const links = await listLinks();
        res.json(links);
    } catch (err) {
        console.error('listLinksHandler error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


async function getLinkStatsHandler(req, res) {
    try {
        const { code } = req.params;
        const link = await findLinkByCode(code);

        if (!link) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(link);
    } catch (err) {
        console.error('getLinkStatsHandler error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


async function deleteLinkHandler(req, res) {
    try {
        const { code } = req.params;
        const deleted = await deleteLinkByCode(code);

        if (!deleted) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('deleteLinkHandler error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


async function redirectHandler(req, res) {
    try {
        const { code } = req.params;
        const link = await findLinkByCode(code);

        if (!link) {
            return res.status(404).send('Not found');
        }

        await incrementClick(code);
        return res.redirect(302, link.url);
    } catch (err) {
        console.error('redirectHandler error:', err);
        res.status(500).send('Server error');
    }
}

module.exports = {
    createLinkHandler,
    listLinksHandler,
    getLinkStatsHandler,
    deleteLinkHandler,
    redirectHandler
};
