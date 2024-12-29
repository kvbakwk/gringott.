{ pkgs }: {
  channel = "stable-23.11";
  services.docker.enable = true;
  packages = [
    pkgs.docker
    pkgs.nodejs_latest
  ];
  idx.extensions = [
    "bradlc.vscode-tailwindcss"
    "esbenp.prettier-vscode"
    "ms-azuretools.vscode-docker"
    "Tomi.xasnippets"
  ];
  idx.previews = { };
}
