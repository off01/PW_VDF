import oracledb from 'oracledb';
import dbConfig from '../../config/db.config';

export async function fetchOrderId(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `
            SELECT o.ORDER_ID  
            FROM "ORDER" o 
            JOIN SUBSCRIPTION_ITEM si ON (o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID)
            WHERE 1=1
            AND si.PRODUCT_CODE LIKE 'WHSFTTHCONN'
            AND o."TYPE" = 'Activation'
            AND o.PARTNER_ORDER_ID LIKE 'PW%'
            AND o.STATUS NOT IN ('Closed','Canceled')
        `;

        const result = await connection.execute(query);

        if (result.rows && result.rows.length > 0) {
            return result.rows[0][0] as string;
        }

        throw new Error("No idWHS_SO found in the database.");

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

export async function fetchOrderIdTerminationL3(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `
        SELECT si.WHS_ASSET_ID  
        FROM "ORDER" o 
        JOIN SUBSCRIPTION_ITEM si ON (o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID)
        WHERE 1=1
        AND si.PRODUCT_CODE LIKE 'WHSFTTHCONN'
        AND o."TYPE" = 'Activation'
        AND o.PARTNER_ORDER_ID LIKE 'BB%'
        AND o.STATUS IN ('Closed')
        AND si.STATUS IN ('Active')
        AND si.WHS_ASSET_ID != '80016090'
        `;

        const result = await connection.execute(query);

        if (result.rows && result.rows.length > 0) {
            return result.rows[0][0] as string;
        }

        throw new Error("No idASSET_sub found in the database.");

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

export async function fetchOrderIdTerminationL1(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `
        SELECT si.WHS_ASSET_ID
        FROM "ORDER" o 
        JOIN SUBSCRIPTION_ITEM si ON (o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID)
        WHERE 1=1
        AND si.PRODUCT_CODE LIKE 'WHSHFCCONN'
        AND o."TYPE" = 'Activation'
        AND o.PARTNER_ORDER_ID LIKE 'PW%'
        AND o.STATUS IN ('Closed')
        AND si.STATUS IN ('Active')
        ORDER BY o.CREATED desc
        `;

        const result = await connection.execute(query);

        if (result.rows && result.rows.length > 0) {
            return result.rows[0][0] as string;
        }

        throw new Error("No idASSET_sub found in the database.");

    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}