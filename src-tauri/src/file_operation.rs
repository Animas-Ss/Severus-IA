use std::fs;
use std::path::PathBuf;
use std::error::Error;

#[tauri::command]
pub fn save_api_key(api_key: String) -> Result<(), String>{
    let path = get_api_key_path().map_err(|e| e.to_string())?;
    fs::write(&path, api_key).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn read_api_key() -> Result<String, String> {
    let path = get_api_key_path().map_err(|e| e.to_string())?;
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