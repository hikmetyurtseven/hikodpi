package com.hikodpi.mobile;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.VpnService;
import android.os.Build;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HikoDpiNative")
public class HikoDpiPlugin extends Plugin {

    private static final String TAG = "HikoDpiPlugin";
    private static final int NOTIFICATION_REQ_CODE = 1005;
    private String pendingPreset = "Discord & Roblox Mobil";
    private PluginCall savedVpnCall = null;

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        Activity activity = getActivity();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && activity != null) {
            if (activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                activity.requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_REQ_CODE);
                JSObject ret = new JSObject();
                ret.put("requested", true);
                call.resolve(ret);
                return;
            }
        }
        JSObject ret = new JSObject();
        ret.put("granted", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void startVpn(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        pendingPreset = call.getString("preset", "Discord & Roblox Mobil");

        // 1. Android 13+ Bildirim iznini denetle
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                activity.requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_REQ_CODE);
            }
        }

        // 2. Android VpnService yetkisini denetle
        Intent prepareIntent = VpnService.prepare(activity);
        if (prepareIntent != null) {
            savedVpnCall = call;
            startActivityForResult(call, prepareIntent, "handleVpnResult");
            Log.i(TAG, "Requesting VPN permission dialog from user");
            return;
        }

        // Zaten yetki varsa doğrudan başlat
        launchVpnService();
        JSObject ret = new JSObject();
        ret.put("active", true);
        ret.put("message", "VPN ve Bildirim Başlatıldı");
        call.resolve(ret);
    }

    @ActivityCallback
    private void handleVpnResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            Log.i(TAG, "User granted VPN permission");
            launchVpnService();
            JSObject ret = new JSObject();
            ret.put("active", true);
            call.resolve(ret);
        } else {
            Log.w(TAG, "User denied VPN permission");
            call.reject("VPN izni kullanıcı tarafından reddedildi.");
        }
    }

    @PluginMethod
    public void stopVpn(PluginCall call) {
        Activity activity = getActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, HikoDpiVpnService.class);
            intent.setAction(HikoDpiVpnService.ACTION_STOP);
            activity.startService(intent);
        }
        JSObject ret = new JSObject();
        ret.put("active", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void getVpnStatus(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("active", HikoDpiVpnService.isServiceRunning());
        ret.put("uptime", HikoDpiVpnService.getUptimeSeconds());
        call.resolve(ret);
    }

    private void launchVpnService() {
        Activity activity = getActivity();
        if (activity == null) return;
        Intent intent = new Intent(activity, HikoDpiVpnService.class);
        intent.putExtra("preset", pendingPreset);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            activity.startForegroundService(intent);
        } else {
            activity.startService(intent);
        }
        Log.i(TAG, "HikoDpiVpnService launched successfully.");
    }
}
