use std::env;
use riverbraid_tsh::{verify_internal, StateInput, scan_constellation};
use riverbraid_types::{AnchorHash};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: tsh <verb> [target] [--anchor <hash>] [--json]");
        std::process::exit(1);
    }

    let verb = &args[1];
    let use_json = args.contains(&"--json".to_string());
    
    // Extract anchor if provided, otherwise default to empty (which will fail verification)
    let anchor_flag = args.iter().position(|r| r == "--anchor");
    let anchor_val = if let Some(pos) = anchor_flag {
        args.get(pos + 1).cloned().unwrap_or_default()
    } else {
        "000000".to_string()
    };

    if verb == "scan" {
        let res = scan_constellation(".");
        if use_json {
            println!("{}", serde_json::to_string_pretty(&res).unwrap());
        } else {
            for node in res.nodes {
                println!("FOUND NODE: {}", node.label);
            }
        }
        std::process::exit(0);
    }

    if verb == "verify" && args.len() >= 3 {
        let target = &args[2];
        let input = StateInput {
            anchor: AnchorHash(anchor_val),
            state_data: format!("Target: {}", target),
            sequence: 1,
        };
        let result = verify_internal(input);
        if use_json {
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
        } else {
            println!("{} | Result: {}", target, result.message);
        }
        std::process::exit(result.exit_code);
    }
}
