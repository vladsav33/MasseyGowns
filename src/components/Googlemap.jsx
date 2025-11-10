import React from "react";

export default function Googlemap() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6078.178454593243!2d175.6197476673282!3d-40.3847150057549!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d41b2a176521105%3A0xa3bc9db4d412e604!2s3%20Refectory%20Road%2C%20Massey%20University%2C%20Turitea%204472!5e0!3m2!1sen!2snz!4v1757123230285!5m2!1sen!2snz"
      title="Googlemap"
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: 0,
        borderRadius: 12,
      }}
      loading="lazy"
      allowFullScreen
    />
  );
}
