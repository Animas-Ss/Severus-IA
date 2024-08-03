// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::fs;
use std::path::PathBuf;
use std::error::Error;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn key(api: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", api)
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


#[tauri::command]
fn save_api_key(key: String) -> Result<(), String>{
    let path = get_api_key_path().map_err(|e| e.to_string())?;
    fs::write(&path, key).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn read_api_key() -> Result<String, String> {
    let path = get_api_key_path().map_err(|e| e.to_string())?;
    if !path.exists(){
        fs::write(&path, "").map_err(|e| e.to_string())?;
    }
    let api_key = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    Ok(api_key)
}

fn get_api_key_path() -> Result<PathBuf, Box<dyn Error>> {
    let mut path = std::env::current_dir()?;
    path.push("my_api");
    fs::create_dir_all(&path)?;
    path.push("api_key.json");
    Ok(path)
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![key, execute_command, prueba, save_api_key, read_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
