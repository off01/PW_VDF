import oracledb from 'oracledb';
import { WHS_DB_CONFIG, FBB_DB_CONFIG } from '../../config/db.config';

export async function fetchOrderId(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
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
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
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
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
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

export async function fetchOrderIdPortationMopIdL1(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(FBB_DB_CONFIG);
        const query = `
        SELECT MOP_ID 
        FROM BO_SUBSCRIPTION bos JOIN FBB_STATE_TBL fst ON (bos.FBB_STATE_ID = FST.FBB_STATE_ID)
        WHERE 1=1
        AND MOP_ID IS NOT NULL
        AND MOP_ID NOT LIKE 'VFFTH%'
        AND EXT_CASE_ID NOT LIKE 'WHS_SO%'
        AND fst.CODE = 'Active'
        ORDER BY CREATED DESC
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

export async function fetchOrderIdPortationMopIdL3(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(FBB_DB_CONFIG);
        const query = `
        SELECT MOP_ID 
        FROM BO_SUBSCRIPTION bos JOIN FBB_STATE_TBL fst ON (bos.FBB_STATE_ID = FST.FBB_STATE_ID)
        WHERE 1=1
        AND MOP_ID IS NOT NULL
        AND MOP_ID NOT LIKE 'VFHFC%'
        AND EXT_CASE_ID NOT LIKE 'WHS_SO%'
        AND fst.CODE = 'Active'
        ORDER BY CREATED DESC
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

export async function fetchInactiveAssetId(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
        const query = `
        SELECT si.WHS_ASSET_ID    
        FROM "ORDER" o 
        JOIN SUBSCRIPTION_ITEM si ON (o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID)
        WHERE 1=1
        AND si.PRODUCT_CODE in ('WHSHFCCONN','WHSFTTHCONN')
        AND o.PARTNER_ORDER_ID LIKE 'PW%'
        AND si.STATUS IN ('Suspend')
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

export async function fetchActiveAssetId(): Promise<string | null> {
    let connection;

    try {
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
        const query = `
        SELECT si.WHS_ASSET_ID  
        FROM "ORDER" o 
        JOIN SUBSCRIPTION_ITEM si ON (o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID)
        WHERE 1=1
        AND si.PRODUCT_CODE in ('WHSHFCCONN')
        AND o.PARTNER_ORDER_ID LIKE 'PW%'
        AND o.STATUS IN ('Closed')
        AND si.STATUS IN ('Active')
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