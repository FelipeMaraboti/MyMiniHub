use tauri::{
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager, WebviewWindowBuilder,
};
use tauri_plugin_positioner::{Position, WindowExt};

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
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
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
        ])
        .setup(|app| {
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
                            // Posiciona no centro da tela ao invés de atrelado ao ícone (evita crash no Windows 11)
                            let _ = window.move_window(Position::Center);
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
                                let _ = window.move_window(Position::Center);
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })?;

            Ok(())
        })
        // ── Fecha popup ao perder foco real da janela ────────
        // WindowEvent::Focused detecta blur da janela nativa,
        // não do webview — não dispara durante drag.
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let tauri::WindowEvent::Focused(false) = event {
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
