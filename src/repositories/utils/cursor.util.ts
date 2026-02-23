const decodeCursor = (cursor: string) => {
    try {

        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        return JSON.parse(decoded) as { createdAt: number, id: string };

    } catch (error) {
        throw new Error("Invalid cursor");
    }
}

const encodeCursor = (cursor: { createdAt: Date, _id: string }) => {
    try {

        return Buffer.from(JSON.stringify({
            createdAt: cursor.createdAt.toISOString(),
            id: cursor._id
        })).toString('base64');

    } catch (error) {
        throw new Error("Invalid cursor");
    }
}

export { encodeCursor, decodeCursor };