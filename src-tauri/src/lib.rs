use tauri::{
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager, WebviewWindowBuilder, State,
};
use tauri_plugin_positioner::{Position, WindowExt};
use std::sync::Mutex;

struct AppConfig {
    position: String,
    hide_on_blur: bool,
}

struct AppState(Mutex<AppConfig>);

// ── Commands ────────────────────────────────────────────────

#[tauri::command]
fn ping() -> String {
    "pong".to_string()
}

#[tauri::command]
fn get_app_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}

// Removido open_tool_window pois a navegação agora é puramente nativa no React
/// Esconde o popup principal (chamado pelo frontend ao perder foco).
#[tauri::command]
fn hide_main_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
}

/// Toggle show/hide da janela principal.
#[tauri::command]
fn toggle_main_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let state = app.state::<AppState>();
            let pos_str = state.0.lock().unwrap().position.clone();
            let pos = match pos_str.as_str() {
                "topRight" => Position::TopRight,
                "topLeft" => Position::TopLeft,
                "bottomRight" => Position::BottomRight,
                _ => Position::Center,
            };
            let _ = window.move_window(pos);
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

#[tauri::command]
fn update_config(app: tauri::AppHandle, position: String, hide_on_blur: bool) {
    let state = app.state::<AppState>();
    let mut config = state.0.lock().unwrap();
    config.hide_on_blur = hide_on_blur;
    config.position = position;
}

// ── Setup ────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            ping,
            get_app_version,
            hide_main_window,
            toggle_main_window,
            update_config,
        ])
        .setup(|app| {
            app.manage(AppState(Mutex::new(AppConfig {
                position: "center".to_string(),
                hide_on_blur: true,
            })));
            // ── Dev tools em debug ───────────────────────────
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }

            // ── Sistema de tray ──────────────────────────────
            let tray = TrayIconBuilder::with_id("main-tray")
                .tooltip("myMiniHub")
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            // Clique no ícone da bandeja → toggle janela
            let app_handle = app.handle().clone();
            tray.on_tray_icon_event(move |_tray, event| {
                if let TrayIconEvent::Click { .. } = event {
                    let app = app_handle.clone();
                    if let Some(window) = app.get_webview_window("main") {
                        if window.is_visible().unwrap_or(false) {
                            let _ = window.hide();
                        } else {
                            let state = app.state::<AppState>();
                            let pos_str = state.0.lock().unwrap().position.clone();
                            let pos = match pos_str.as_str() {
                                "topRight" => Position::TopRight,
                                "topLeft" => Position::TopLeft,
                                "bottomRight" => Position::BottomRight,
                                _ => Position::Center,
                            };
                            let _ = window.move_window(pos);
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                }
            });

            // ── Atalho global: Ctrl+Shift+Space ─────────────
            use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
            let shortcut: Shortcut = "Ctrl+Shift+Space".parse().unwrap();
            let app_handle2 = app.handle().clone();
            app.global_shortcut()
                .on_shortcut(shortcut, move |_app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        let a = app_handle2.clone();
                        if let Some(window) = a.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let state = a.state::<AppState>();
                                let pos_str = state.0.lock().unwrap().position.clone();
                                let pos = match pos_str.as_str() {
                                    "topRight" => Position::TopRight,
                                    "topLeft" => Position::TopLeft,
                                    "bottomRight" => Position::BottomRight,
                                    _ => Position::Center,
                                };
                                let _ = window.move_window(pos);
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let tauri::WindowEvent::Focused(false) = event {
                    let state = window.state::<AppState>();
                    if state.0.lock().unwrap().hide_on_blur {
                        let _ = window.hide();
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
