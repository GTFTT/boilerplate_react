/** Constants **/

export const moduleName = 'vehiclesPage';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLES = `${prefix}/FETCH_VEHICLES`;
export const FETCH_VEHICLES_SUCCESS = `${prefix}/FETCH_VEHICLES_SUCCESS`;

export const FETCH_VEHICLE_ORDERS = `${prefix}/FETCH_VEHICLE_ORDERS`;
export const FETCH_VEHICLE_ORDERS_SUCCESS = `${prefix}/FETCH_VEHICLE_ORDERS_SUCCESS`;

export const SET_FETCHING_VEHICLE_ORDERS = `${prefix}/SET_FETCHING_VEHICLE_ORDERS`;
export const SET_FETCHING_VEHICLES = `${prefix}/SET_FETCHING_VEHICLES`;
export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_PAGE_ORDERS = `${prefix}/SET_PAGE_ORDERS`;
export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;

export const SET_EXPANDED_VEHICLE_ID = `${prefix}/SET_EXPANDED_VEHICLE_ID`;

/** Reducer **/
const ReducerState = {
    vehicles:      [],      // All vehicles, array of the can be used in a table
    stats:         {},      // Vehicles stats

    fetchingVehicleOrders: false,
    fetchingVehicles: false,

    vehicleOrdersData: {
        orders: [], //Array of orders fetched for specific vehicle
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined
        }
    },

    expandedVehicleId: undefined, //Currently selected vehicle

    filters: { // Filters of vehicles
        query: undefined,
    },
    sort: { // Sort of vehicles
        page: 1
    }
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_VEHICLES_SUCCESS:
            const {vehicles, stats} = payload;
            return { 
                ...state, 
                vehicles: vehicles,
                stats: stats
            };

        case SET_PAGE:
            const { page } = payload;
            return {
                ...state,
                sort: {
                    ...state.sort,
                    page: page
                }
            };

        case SET_FETCHING_VEHICLE_ORDERS:
            return {
                ...state,
                fetchingVehicleOrders: payload,
            };

        case SET_FETCHING_VEHICLES:
            return {
                ...state,
                fetchingVehicles: payload,
            };

        case SET_PAGE_ORDERS:
            const { page: pageOrders } = payload;

            return {
                ...state,
                vehicleOrdersData: {
                    ...state.vehicleOrdersData,
                    sort: {
                        ...state.vehicleOrdersData.sort,
                        page: pageOrders
                    }
                }
            }
            
        case SET_SEARCH_QUERY:
            const { query } = payload;
            return {
                ...state,
                filters: {
                    ...state.filters,
                    query: query
                }
            };
        
        case SET_EXPANDED_VEHICLE_ID:
            const { vehicleId } = payload;
            return {
                ...state,
                expandedVehicleId: vehicleId
            };

        case FETCH_VEHICLE_ORDERS_SUCCESS:
            const {orders, stats: vehicleOrdersStats} = payload;
            return {
                ...state,
                vehicleOrdersData: {
                    ...state.vehicleOrdersData,
                    orders: orders,
                    stats: vehicleOrdersStats
                }
            };

        default: return state;
    }
}

/** Selectors **/

export const stateSelector = state => state[ moduleName ];

export const selectFetchingVehicles = state => state[ moduleName ].fetchingVehicles;
export const selectFetchingVehicleOrders = state => state[ moduleName ].fetchingVehicleOrders;
export const selectVehicles = state => state[ moduleName ].vehicles;
export const selectVehiclesStats = state => state[ moduleName ].stats;
export const selectSort = state => state[ moduleName ].sort;
export const selectFilters = state => state[ moduleName ].filters;
export const selectExpandedVehicleId = state => state[ moduleName ].expandedVehicleId;

/*---------------------Orders-------------------------------------------*/
export const selectVehicleOrders = state => state[ moduleName ].vehicleOrdersData.orders;
export const selectVehicleOrdersStats = state => state[ moduleName ].vehicleOrdersData.stats;
export const selectVehicleOrdersSort = state => state[ moduleName ].vehicleOrdersData.sort;
export const selectVehicleOrdersFilters = state => state[ moduleName ].vehicleOrdersData.filters;
export const selectVehicleOrdersFetching = state => state[ moduleName ].vehicleOrdersData.fetching;

/** Action Creators **/

/** Fetch all vehicles */
export const fetchVehicles = () => ({
    type: FETCH_VEHICLES,
});

export const fetchVehiclesSuccess = ({vehicles, stats}) => ({
    type:    FETCH_VEHICLES_SUCCESS,
    payload: {vehicles, stats},
});

/**
 * Fetches orders where vehicle was participating.
 * Vehicle is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
export const fetchVehicleOrders = () => ({
    type:    FETCH_VEHICLE_ORDERS
});

export const fetchVehicleOrdersSuccess = ({orders, stats}) => ({
    type:    FETCH_VEHICLE_ORDERS_SUCCESS,
    payload: {orders, stats},
});

/** Set filtering page, automatically fetches vehicles */
export const setPage = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE,
            payload: {page}
        });
        return dispatch(fetchVehicles());
    }
};

export const setFetchingVehicleOrders = (value) => ({
    type: SET_FETCHING_VEHICLE_ORDERS,
    payload: value
});

export const setFetchingVehicles = (value) => ({
    type: SET_FETCHING_VEHICLES,
    payload: value
});

/** Set filtering page, automatically fetches orders */
export const setPageOrders = ({ page }) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_ORDERS,
            payload: { page }
        });
        return dispatch(fetchVehicleOrders());
    }
};

/** Set filtering query for vehicles, automatically fetches vehicles */
export const setSearchQuery = ({query}) => {
    return (dispatch) => {
        dispatch({
            type: SET_SEARCH_QUERY,
            payload: {query}
        });
        return dispatch(fetchVehicles());
    }
};

/** Set expanded vehicle id to load data for it(all the orders for that vehicle), automatically fetches orders. Use this to load data for any car by its is. */
export const setExpandedVehicleId = ({vehicleId}) => {
    return (dispatch) => {
        dispatch({
            type: SET_EXPANDED_VEHICLE_ID,
            payload: {vehicleId}
        });

        vehicleId && (vehicleId != "") && dispatch(fetchVehicleOrders()); //Fetch only if Id is valid
    }
};