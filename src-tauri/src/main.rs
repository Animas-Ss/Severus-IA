// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn prueba(cm: &str) -> String{
    format!("Hello, {}! You've been greeted from Rust!", cm)
}

#[tauri::command]
fn execute_command(comandos: [&str; 2]) -> Result<String, String> {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg(comandos[1])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let output2 = Command::new("cmd")
            .arg("/C")
            .arg(comandos[0])
            .output()
            .map_err(|e| e.to_string())?;
        print!("entro al segundo comando {}", comandos[0]);
        if !output2.status.success() {
            let stderr = String::from_utf8(output2.stderr).map_err(|e| e.to_string())?;
            return Err(stderr);
        } else {
            let stdout = String::from_utf8(output2.stdout).map_err(|e| e.to_string())?;
            return Ok(stdout);
        }
    }
    let stdout = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;
    Ok(stdout)
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, execute_command, prueba])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
