package com.wakidrive;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.RNFirebasePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RealmReactPackage(),
            new BackgroundTaskPackage(),
            new RNCWebViewPackage(),
            new RNNetworkInfoPackage(),
            new RNDeviceInfo(),
            new RNFirebasePackage(),
            new ReactNativeConfigPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    BackgroundTaskPackage.useContext(this);
  }
}
