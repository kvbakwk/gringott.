{pkgs}: {
  channel = "stable-23.11";
  services.docker.enable = true;
  packages = [
    pkgs.nodejs_20
    pkgs.docker
  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    
  };
}