use std::fs;
use riverbraid_types::{
    AnchorHash, InvariantId, InvariantResult, StateLabel, 
    CommandResult, GENESIS_ANCHOR, Node, Relation, RelationalMap
};

pub struct StateInput {
    pub anchor: AnchorHash,
    pub state_data: String,
    pub sequence: u64,
}

pub fn scan_constellation(root: &str) -> RelationalMap {
    let mut nodes = Vec::new();
    let mut relations = Vec::new();
    let paths = fs::read_dir(root).unwrap();

    for path in paths {
        let entry = path.unwrap();
        let p = entry.path();
        if p.is_dir() {
            let anchor_file = p.join(".anchor");
            if anchor_file.exists() {
                let name = p.file_name().unwrap().to_str().unwrap().to_string();
                nodes.push(Node { id: name.clone(), label: name.clone() });
                
                let content = fs::read_to_string(anchor_file).unwrap_or_default();
                // Strip whitespace and potential Byte Order Marks
                let clean = content.trim().trim_start_matches('\u{feff}'); 
                let weight = if clean == GENESIS_ANCHOR { 1.0 } else { 0.0 };
                
                relations.push(Relation {
                    source: name,
                    target: "Genesis".to_string(),
                    weight,
                });
            }
        }
    }
    RelationalMap { nodes, relations }
}

pub fn verify_internal(input: StateInput) -> CommandResult {
    let passing = input.anchor.0 == GENESIS_ANCHOR;
    CommandResult {
        id: "verify-001".to_string(),
        success: passing,
        message: if passing { "STATIONARY".to_string() } else { "DRIFT".to_string() },
        exit_code: if passing { 0 } else { 1 },
    }
}
