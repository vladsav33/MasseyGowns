import React from "react";

export default function Googlemap() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.076735639686!2d175.6176663761832!3d-40.38499187144479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d41b2a176521105%3A0xa3bc9db4d412e604!2s3%20Refectory%20Road%2C%20Massey%20University%2C%20Turitea%204410!5e0!3m2!1szh-CN!2snz!4v1755229180950!5m2!1szh-CN!2snz"
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
