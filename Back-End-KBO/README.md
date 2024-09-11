### Initiation Docker MongoDB

1. **Dupliquer le .env.local, le renommer en .env et le modifier**
   
   ``
        URL_MONGO=mongodbx://nomdutilisateur:motdepasse@127.0.0.1:27017/project_kbo?auhtSource=admin
        ROOT_USERNAME_DB=root
        ROOT_PASSWORD_DB=motdepasseroot
        DATABASE=basededonnee
        USERNAME_DB=nomdutilisateur
        PASSWORD_DB=motdepasse

   ``
   
2. **Exécuter cette commande pour build l'image docker**

    ``bash
        docker compose --env-file .env up --build
    ``