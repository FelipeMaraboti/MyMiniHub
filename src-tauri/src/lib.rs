use tauri::{
    Manager,
    tray::{TrayIconBuilder, TrayIconEvent},
    WebviewWindowBuilder,
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

/// Abre uma janela secundária para uma ferramenta específica.
#[tauri::command]
fn open_tool_window(app: tauri::AppHandle, tool_id: String, tool_name: String) {
    let label = format!("tool-{}", tool_id);

    // Se já existe, foca nela
    if let Some(window) = app.get_webview_window(&label) {
        let _ = window.show();
        let _ = window.set_focus();
        return;
    }

    // Cria janela nova
    let url = format!("/#/tool/{}", tool_id);
    let _ = WebviewWindowBuilder::new(&app, &label, tauri::WebviewUrl::App(url.into()))
        .title(tool_name)
        .inner_size(900.0, 650.0)
        .min_inner_size(700.0, 500.0)
        .center()
        .decorations(true)
        .resizable(true)
        .visible(true)
        .build();

    // Esconde o popup principal ao abrir tool
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.hide();
    }
}

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
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            ping,
            get_app_version,
            open_tool_window,
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
                            // Posiciona próximo ao ícone do tray
                            let _ = window.move_window(Position::TrayCenter);
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
            app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
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
