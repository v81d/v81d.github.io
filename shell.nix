{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [
    vue-language-server
    vtsls
    prettier
    nodejs_24
  ];

  shellHook = ''
    echo -e "\033[1;32mWelcome to the v81d.github.io development environment!\033[0m"
    echo -e "\033[1;34mAvailable aliases:\033[0m"

    i() { npm install "$@"; }
    d() { npm run dev "$@"; }
    b() { npm run build "$@"; }

    export -f i d b

    echo -e "  \033[1;33mi\033[0m   npm install"
    echo -e "  \033[1;33md\033[0m   npm run dev"
    echo -e "  \033[1;33mb\033[0m   npm run build"

    echo
  '';
}
