{
  description = "PHP, with Reactjs and Postgresql Development Environment";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };
  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs =
          with pkgs;
          let
            php = pkgs.php84.buildEnv {
              extraConfig = "
                upload_max_filesize = 2G
                post_max_size = 3G
                memory_limit = 2G
              ";
            };
          in
          [
            awscli2
            php
            nodejs_24
            prettier
            eslint
            eslint_d
            prettierd
            vue-language-server
            vtsls
            typescript-language-server
            vscode-langservers-extracted
            phpactor
            phpPackages.php-cs-fixer
            intelephense
            php.packages.composer
            phpExtensions.mysqlnd
            phpExtensions.mysqli
            phpExtensions.pdo
            pgadmin4-desktopmode
            opentofu
            tofu-ls
          ];
        shellHook = ''
          echo "Welcome to the Laravel Development with reactjs and postgresql"
        '';
      };
    };
}
