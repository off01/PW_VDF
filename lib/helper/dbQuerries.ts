import oracledb from "oracledb";
import config from "../../config/config";

const { WHS_DB_CONFIG, FBB_DB_CONFIG } = config.dbConfig;

/**
 * Asynchronously retrieves the latest order ID for the specified product code.
 *
 * This function executes an SQL query in the Oracle database to find the maximum order ID
 * (ORDER_ID) for products with the specified product code (`pc`) that are in the 'New' state. The selection is further
 * is limited to orders whose PARTNER_ORDER_ID starts with 'PW_' and which are not closed,
 * cancelled or already processed. The function will return the most recent ORDER_ID of these records.
 *
 * @param {string} pc - Produktový kód pro vyhledání ID objednávky (WHSFTTHCONN nebo WHSHFCCONN).
 * @returns {Promise<string | null>} Promise, který se po úspěšném provedení dotazu 
 *                                   vyřeší s nejnovějším ORDER_ID jako string, nebo s null, 
 *                                   pokud nebyl nalezen žádný odpovídající záznam.
 * @throws {Error} Pokud dojde k chybě během vykonávání dotazu nebo při práci s databází,
 *                 funkce vyhodí výjimku s popisem chyby.
 */

export async function fetchOrderId(pc: string): Promise<string | null> {
  let connection;

  try {
    connection = await oracledb.getConnection(WHS_DB_CONFIG);
    const query = `
    SELECT 
      MAX(o.ORDER_ID) KEEP (DENSE_RANK LAST ORDER BY o.CREATED) AS LastOrderID
    FROM "ORDER" o
    JOIN SUBSCRIPTION_ITEM si ON o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID
    WHERE 1=1
    AND si.STATUS = 'New'
    AND si.PRODUCT_CODE = :pc
    AND o.PARTNER_ORDER_ID LIKE 'PW_%'
    AND NOT EXISTS (
    SELECT 1
      FROM "ORDER" o2
      JOIN SUBSCRIPTION_ITEM si2 ON o2.SUBSCRIPTION_ID = si2.SUBSCRIPTION_ID
      WHERE si2.WHS_ASSET_ID = si.WHS_ASSET_ID
      AND o2.STATUS IN ('Closed', 'Canceled', 'OrderProvisioned')
    )
    GROUP BY si.WHS_ASSET_ID
    ORDER BY LastOrderID DESC
        `;

    const result = await connection.execute(query, { pc });

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

/**
 * Asynchronously retrieves the asset ID (WHS_ASSET_ID) based on the specified status and product code.
 *
 * This function queries the Oracle database and retrieves asset IDs that match 
 * the specified status and product code. Filters records that have PARTNER_ORDER_ID 
 * starting with 'PW' and there is no related record in the "ORDER" table 
 * with a status other than 'Closed'.
 * The function returns the first WHS_ASSET_ID found if there are matching records, 
 * Otherwise it raises an exception.
 *
 * @param {string} status - Stav, podle kterého se vyhledávají (Active, Suspend etc).
 * @param {string} pc - Produktový kód, podle kterého se vyhledávají (WHSFTTHCONN nebo WHSHFCCONN).
 * @returns {Promise<string | null>} Promise, který se po úspěšném provedení dotazu 
 *                                  vyřeší s nalezeným WHS_ASSET_ID jako string, 
 *                                  nebo s null, pokud nebyl nalezen žádný odpovídající záznam.
 * @throws {Error} Pokud dojde k chybě během vykonávání dotazu nebo při práci s databází,
 *                 funkce vyhodí výjimku s popisem chyby.
 */

export async function fetchAssetId(status: string, pc: string): Promise<string | null> {
  let connection;

  try {
    connection = await oracledb.getConnection(WHS_DB_CONFIG);
    const query = `
    SELECT DISTINCT
    si.WHS_ASSET_ID
    FROM "ORDER" o
    JOIN SUBSCRIPTION_ITEM si ON o.SUBSCRIPTION_ID = si.SUBSCRIPTION_ID
    WHERE 1=1
    AND si.STATUS = :status
    AND si.PRODUCT_CODE = :pc
    AND o.PARTNER_ORDER_ID LIKE 'PW%'
    AND NOT EXISTS (
      SELECT 1
      FROM "ORDER" o2
      JOIN SUBSCRIPTION_ITEM si2 ON o2.SUBSCRIPTION_ID = si2.SUBSCRIPTION_ID
      WHERE si2.WHS_ASSET_ID = si.WHS_ASSET_ID
      AND o2.STATUS NOT IN ('Closed')
    )
    ORDER BY si.WHS_ASSET_ID DESC
        `;

    const result = await connection.execute(query, { status, pc });

    if (result.rows && result.rows.length > 0) {
      return result.rows[0][0] as string;
    }

    throw new Error("No DATA found in the database.");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Retrieves the MOP port ID of the specified PC prefix.
 *
 * This asynchronous function executes an SQL query to the Oracle database to retrieve the MOP_ID.
 * Searches for active records that match the specified PC prefix and are not marked as WHS_SO.
 * The function returns the first MOP_ID found or throws an error if no matching record is found.
 *
 * @param {string} prefixpc - Prefix pro vyhledání MOP ID (VFHFC% nebo VFFTTH%).
 * @returns {Promise<string | null>} Promise, který se po úspěšném provedení dotazu 
 *                                  vyřeší s nalezeným MOP_ID jako string, nebo s null, 
 *                                  pokud nebyl nalezen žádný odpovídající záznam.
 * @throws {Error} Pokud dojde k chybě během vykonávání dotazu nebo při práci s databází,
 *                 funkce vyhodí výjimku s popisem chyby.
 */

export async function fetchOrderIdPortationMopId(prefixpc: string): Promise<string | null> {
  let connection;

  try {
    connection = await oracledb.getConnection(FBB_DB_CONFIG);
    const query = `
        SELECT MOP_ID 
        FROM BO_SUBSCRIPTION bos JOIN FBB_STATE_TBL fst ON (bos.FBB_STATE_ID = FST.FBB_STATE_ID)
        WHERE 1=1
        AND MOP_ID IS NOT NULL
        AND MOP_ID LIKE :prefixpc
        AND EXT_CASE_ID NOT LIKE 'WHS_SO%'
        AND fst.CODE = 'Active'
        ORDER BY CREATED DESC
        `;

    const result = await connection.execute(query, { prefixpc });

    if (result.rows && result.rows.length > 0) {
      return result.rows[0][0] as string;
    }

    throw new Error("No DATA found in the database.");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Retrieves and transforms hardware and tariff modification data from the database.
 *
 * This asynchronous function executes a complex SQL query to the Oracle database to retrieve detailed information 
 * The function expects specific HW and tariff codes as input parameters.
 * The result is structured as an object with keys corresponding to various properties of the retrieved data.
 * 
 * @param {string} hwdb - Kód hardwaru, který má být vyhledán.
 * @param {string} [tariffdb=null] - Kód tarifu, který má být vyhledán. Je volitelný a výchozí hodnota je `null`.
 * @returns {Promise<Record<string, string>>} Promise, který se po úspěšném provedení dotazu
 *                                            vyřeší s objektem obsahujícím data o HW a tarifech.
 *                                            Každý klíč objektu reprezentuje jednu vlastnost (např. `WHS_ASSET_ID1`, `Tarif`),
 *                                            a hodnota je odpovídající řetězec.
 * @throws {Error} Pokud dojde k chybě během vykonávání dotazu nebo při práci s databází,
 *                 nebo pokud nejsou nalezena žádná data, funkce vyhodí výjimku s popisem chyby.
 */

export async function fetchDataModification(hwdb: string, tariffdb: string = null): Promise<Record<string, string>> {
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
        AND (:tariffdb IS NULL OR tariff.PRODUCT_CODE = :tariffdb)
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
        snNumber: result.rows[0][8],
      };
    }

    throw new Error("No DATA found in the database.");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
