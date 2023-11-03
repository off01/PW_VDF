import oracledb from 'oracledb';
import config from '../../config/config';

const { WHS_DB_CONFIG, FBB_DB_CONFIG } = config.dbConfig;

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

export async function fetchDataModificationL1_L3_WH(hwdb: string): Promise<{[key: string]: string}> {
    let connection;

    try {
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
        const query = `
        WITH AttributeData AS (
            -- Subdotaz pro ATTRIBUTE data
            SELECT 
                ENTITY_ID,
                MAX(CASE WHEN NAME = 'macAddress' THEN VALUE END) AS macAddress,
                MAX(CASE WHEN NAME = 'rid' THEN VALUE END) AS rid,
                MAX(CASE WHEN NAME = 'snNumber' THEN VALUE END) AS snNumber
            FROM "ATTRIBUTE"
            WHERE ENTITY_TYPE = 'SubscriptionItem' 
            AND NAME IN ('macAddress', 'rid', 'snNumber')
            GROUP BY ENTITY_ID
        ),
        AssetData AS (
            -- Subdotaz pro SUBSCRIPTION_ITEM data
            SELECT 
                SUBSCRIPTION_ID,
                MAX(CASE WHEN rn = 1 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID1,
                MAX(CASE WHEN rn = 2 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID2,
                MAX(CASE WHEN rn = 3 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID3,
                MAX(CASE WHEN rn = 4 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID4
            FROM (
                SELECT 
                    SUBSCRIPTION_ID, 
                    WHS_ASSET_ID,
                    ROW_NUMBER() OVER(PARTITION BY SUBSCRIPTION_ID ORDER BY WHS_ASSET_ID) AS rn
                FROM SUBSCRIPTION_ITEM
                WHERE STATUS = 'Active'
            ) sub
            GROUP BY SUBSCRIPTION_ID
        )
        SELECT
            asd.WHS_ASSET_ID1, 
            asd.WHS_ASSET_ID2, 
            asd.WHS_ASSET_ID3, 
            asd.WHS_ASSET_ID4,
            tariff.PRODUCT_CODE AS Tarif,
            hw.PRODUCT_CODE AS HW,
            ad.macAddress,
            ad.rid, 
            ad.snNumber 
        FROM SUBSCRIPTION_ITEM si
        JOIN SUBSCRIPTION s  ON si.SUBSCRIPTION_ID = s.SUBSCRIPTION_ID
        JOIN AttributeData ad ON ad.ENTITY_ID = si.SUBSCRIPTION_ITEM_ID
        JOIN AssetData asd ON si.SUBSCRIPTION_ID = asd.SUBSCRIPTION_ID
        LEFT JOIN SUBSCRIPTION_ITEM tariff ON si.SUBSCRIPTION_ID = tariff.SUBSCRIPTION_ID AND tariff.PRODUCT_TYPE = 'Product' AND tariff.ROOT_ITEM_ID  = 2 AND tariff.STATUS = 'Active' AND tariff.PRODUCT_CODE LIKE 'WHSDATA%'
        LEFT JOIN SUBSCRIPTION_ITEM hw ON si.SUBSCRIPTION_ID = hw.SUBSCRIPTION_ID AND hw.PRODUCT_TYPE = 'Product' AND hw.ROOT_ITEM_ID  = 2 AND hw.STATUS = 'Active' AND hw.PRODUCT_CODE LIKE 'WHSHW%'
        WHERE 1=1
        AND hw.PRODUCT_CODE = :hwdb
        AND s.STATUS = 'Active'
        AND s.CREATED >= ADD_MONTHS(SYSDATE, -6)
        AND EXISTS (
            SELECT 1
            FROM "ORDER_ITEM" oi
            JOIN "ORDER" o ON oi.ORDER_ID = o.ORDER_ID
            WHERE oi.WHS_ASSET_ID IN (asd.WHS_ASSET_ID1, asd.WHS_ASSET_ID2, asd.WHS_ASSET_ID3, asd.WHS_ASSET_ID4)
            AND o.STATUS = 'Closed'
            AND oi.STATUS = 'Completed'
        )
        -- Nová kontrola: Zajištění, že neexistuje objednávka pro asset, která není ve stavu 'Closed' nebo 'Cancelled'
        AND NOT EXISTS (
            SELECT 1
            FROM "ORDER_ITEM" oi2
            JOIN "ORDER" o2 ON oi2.ORDER_ID = o2.ORDER_ID
            WHERE oi2.WHS_ASSET_ID IN (asd.WHS_ASSET_ID1, asd.WHS_ASSET_ID2, asd.WHS_ASSET_ID3, asd.WHS_ASSET_ID4)
            AND o2.STATUS NOT IN ('Closed', 'Cancelled')
        )
        ORDER BY s.CREATED desc
        `;

        const result = await connection.execute(query, { hwdb });

        if (result.rows && result.rows.length > 0) {
            return {
            WHS_ASSET_ID1: result.rows[0][0],
            WHS_ASSET_ID2: result.rows[0][1],
            WHS_ASSET_ID3: result.rows[0][2],
            WHS_ASSET_ID4: result.rows[0][3],
            Tarif: result.rows[0][4],
            HW: result.rows[0][5],
            macAddress: result.rows[0][6],
            rid: result.rows[0][7],
            snNumber: result.rows[0][8]
            }
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

export async function fetchDataModificationL1_tariff(tariffdb: string, hwdb: string): Promise<{[key: string]: string}> {
    let connection;

    try {
        connection = await oracledb.getConnection(WHS_DB_CONFIG);
        const query = `
        WITH AttributeData AS (
            -- Subdotaz pro ATTRIBUTE data
            SELECT 
                ENTITY_ID,
                MAX(CASE WHEN NAME = 'macAddress' THEN VALUE END) AS macAddress,
                MAX(CASE WHEN NAME = 'rid' THEN VALUE END) AS rid,
                MAX(CASE WHEN NAME = 'snNumber' THEN VALUE END) AS snNumber
            FROM "ATTRIBUTE"
            WHERE ENTITY_TYPE = 'SubscriptionItem' 
            AND NAME IN ('macAddress', 'rid', 'snNumber')
            GROUP BY ENTITY_ID
        ),
        AssetData AS (
            -- Subdotaz pro SUBSCRIPTION_ITEM data
            SELECT 
                SUBSCRIPTION_ID,
                MAX(CASE WHEN rn = 1 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID1,
                MAX(CASE WHEN rn = 2 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID2,
                MAX(CASE WHEN rn = 3 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID3,
                MAX(CASE WHEN rn = 4 THEN WHS_ASSET_ID END) AS WHS_ASSET_ID4
            FROM (
                SELECT 
                    SUBSCRIPTION_ID, 
                    WHS_ASSET_ID,
                    ROW_NUMBER() OVER(PARTITION BY SUBSCRIPTION_ID ORDER BY WHS_ASSET_ID) AS rn
                FROM SUBSCRIPTION_ITEM
                WHERE STATUS = 'Active'
            ) sub
            GROUP BY SUBSCRIPTION_ID
        )
        SELECT
            asd.WHS_ASSET_ID1, 
            asd.WHS_ASSET_ID2, 
            asd.WHS_ASSET_ID3, 
            asd.WHS_ASSET_ID4,
            tariff.PRODUCT_CODE AS Tarif,
            hw.PRODUCT_CODE AS HW,
            ad.macAddress,
            ad.rid, 
            ad.snNumber 
        FROM SUBSCRIPTION_ITEM si
        JOIN SUBSCRIPTION s  ON si.SUBSCRIPTION_ID = s.SUBSCRIPTION_ID
        JOIN AttributeData ad ON ad.ENTITY_ID = si.SUBSCRIPTION_ITEM_ID
        JOIN AssetData asd ON si.SUBSCRIPTION_ID = asd.SUBSCRIPTION_ID
        LEFT JOIN SUBSCRIPTION_ITEM tariff ON si.SUBSCRIPTION_ID = tariff.SUBSCRIPTION_ID AND tariff.PRODUCT_TYPE = 'Product' AND tariff.ROOT_ITEM_ID  = 2 AND tariff.STATUS = 'Active' AND tariff.PRODUCT_CODE LIKE 'WHSDATA%'
        LEFT JOIN SUBSCRIPTION_ITEM hw ON si.SUBSCRIPTION_ID = hw.SUBSCRIPTION_ID AND hw.PRODUCT_TYPE = 'Product' AND hw.ROOT_ITEM_ID  = 2 AND hw.STATUS = 'Active' AND hw.PRODUCT_CODE LIKE 'WHSHW%'
        WHERE 1=1
        AND tariff.PRODUCT_CODE = :tariffdb
        AND hw.PRODUCT_CODE = :hwdb
        AND s.STATUS = 'Active'
        AND s.CREATED >= ADD_MONTHS(SYSDATE, -6)
        AND EXISTS (
            SELECT 1
            FROM "ORDER_ITEM" oi
            JOIN "ORDER" o ON oi.ORDER_ID = o.ORDER_ID
            WHERE oi.WHS_ASSET_ID IN (asd.WHS_ASSET_ID1, asd.WHS_ASSET_ID2, asd.WHS_ASSET_ID3, asd.WHS_ASSET_ID4)
            AND o.STATUS = 'Closed'
            AND oi.STATUS = 'Completed'
        )
        -- Nová kontrola: Zajištění, že neexistuje objednávka pro asset, která není ve stavu 'Closed' nebo 'Cancelled'
        AND NOT EXISTS (
            SELECT 1
            FROM "ORDER_ITEM" oi2
            JOIN "ORDER" o2 ON oi2.ORDER_ID = o2.ORDER_ID
            WHERE oi2.WHS_ASSET_ID IN (asd.WHS_ASSET_ID1, asd.WHS_ASSET_ID2, asd.WHS_ASSET_ID3, asd.WHS_ASSET_ID4)
            AND o2.STATUS NOT IN ('Closed', 'Cancelled')
        )
        ORDER BY s.CREATED desc
        `;

        const result = await connection.execute(query, { tariffdb, hwdb });

        if (result.rows && result.rows.length > 0) {
            return {
            WHS_ASSET_ID1: result.rows[0][0],
            WHS_ASSET_ID2: result.rows[0][1],
            WHS_ASSET_ID3: result.rows[0][2],
            WHS_ASSET_ID4: result.rows[0][3],
            Tarif: result.rows[0][4],
            HW: result.rows[0][5],
            macAddress: result.rows[0][6],
            rid: result.rows[0][7],
            snNumber: result.rows[0][8]
            }
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