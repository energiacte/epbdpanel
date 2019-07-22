#[macro_use]
extern crate serde_derive;

use wasm_bindgen::prelude::*;

use cteepbd::{ self, cte, Components, Factors, RenNren, Balance };

#[wasm_bindgen]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// Convierte cadena a componentes
#[wasm_bindgen]
pub fn parse_components(datastring: &str) -> JsValue {
    let comps: Components = cte::parse_components(datastring).unwrap();
    JsValue::from_serde(&comps).unwrap()
}

// Estructuras para gestión de factores de usuario
#[allow(non_snake_case)]
#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsCogenUserOptions {
    A_RED: Option<RenNren>,
    A_NEPB: Option<RenNren>,
}

#[allow(non_snake_case)]
#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsRedUserOptions {
    RED1: Option<RenNren>,
    RED2: Option<RenNren>,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct WFactorsUserOptions {
    cogen: Option<WFactorsCogenUserOptions>,
    red: Option<WFactorsRedUserOptions>,
    strip_nepb: Option<bool>,
}

// Obtén factores a partir de la localización y los factores de usuario
//
// El campo de opciones tiene que ser al menos {}
#[wasm_bindgen]
pub fn new_wfactors(loc: &str, indicator: &str, options: &JsValue) -> JsValue {
    let defaults_wf = if indicator == "CO2" {cte::CTE_DEFAULTS_WF_CO2} else {cte::CTE_DEFAULTS_WF_EP};
    // XXX: puede tener errores de formato
    let rsoptions: WFactorsUserOptions = options.into_serde().unwrap();
    let red1 = rsoptions
        .red
        .and_then(|v| v.RED1)
        .or(Some(defaults_wf.user.red1));
    let red2 = rsoptions
        .red
        .and_then(|v| v.RED2)
        .or(Some(defaults_wf.user.red2));
    let cogen_to_grid = rsoptions.cogen.and_then(|v| v.A_RED).or(None);
    let cogen_to_nepb = rsoptions.cogen.and_then(|v| v.A_NEPB).or(None);
    let strip_nepb = rsoptions.strip_nepb.unwrap_or(false);
    let user_wf = cte::CteUserWF {
        red1,
        red2,
        cogen_to_grid,
        cogen_to_nepb,
    };
    // XXX: Puede tener errores de parsing o de localidad
    let fp: Factors = cte::wfactors_from_loc(loc, &user_wf, &defaults_wf, strip_nepb).unwrap();
    JsValue::from_serde(&fp).unwrap()
}

// Calcula eficiencia energética
#[wasm_bindgen]
pub fn energy_performance(components: &JsValue, wfactors: &JsValue, kexp: f32, area: f32) -> JsValue {
    let comps: Components = components.into_serde().unwrap();
    let wfacs: Factors = wfactors.into_serde().unwrap();
    let balance: Balance = cteepbd::energy_performance(&comps, &wfacs, kexp, area).unwrap();
    JsValue::from_serde(&balance).unwrap()
}

// Calcula eficiencia energética para el perímetro próximo y servicio de ACS
#[wasm_bindgen]
pub fn energy_performance_acs_nrb(components: &JsValue, wfactors: &JsValue, kexp: f32, area: f32) -> JsValue {
    let comps: Components = components.into_serde().unwrap();
    let wfacs: Factors = wfactors.into_serde().unwrap();

    // componentes para ACS
    let comps_acs = cte::components_by_service(&comps, cteepbd::Service::ACS);
    let wfacs_nrb = cte::wfactors_to_nearby(&wfacs);
    let balance: Balance = cteepbd::energy_performance(&comps_acs, &wfacs_nrb, kexp, area).unwrap();
    JsValue::from_serde(&balance).unwrap()
}



// TODO: gestionar errores en JS para eliminar estos unwrap
