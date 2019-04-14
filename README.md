# Documentation Spinner

Spinner permet de créer un loader et de l'activer/désactiver.

## Exemple

    // Init
    var spinner = $('#container').spinner([options]);
    
    // Show
    spinner.show();
    
    // Hide
    spinner.hide();


## Options

| Option                               | Type     | Valeur par défaut        | Description                                                           |
|--------------------------------------|----------|--------------------------|-----------------------------------------------------------------------|
| auto                                 | boolean  | false                    | Auto show/hide le spinner en fonction des requêtes XHR exécutées      |
| autoPathsExceptions                  | array    | []                       | Liste d'urls où il ne faut pas afficher le spinner en mode auto       |
| type                                 | string   | 'overlay'                | Type du spinner : 'overlay', 'inline' ou 'button'                     |
| wrapper                              | boolean  | true                     | Ajouter des éléments html dans le conteneur (wrapper + wrapper-inner) |
| spinner                              | boolean  | true                     | Afficher l'image du spinner                                           |
| text                                 | string   | undefined                | Afficher un texte pendant le chargement                               |
| minTimeout                           | integer  | 600                      | Permet d'afficher au minimum le spinner au temps défini               |
| maxTimeout                           | integer  | 8000                     | Permet de masquer automatiquement le spinner au temps défini          |
| classes                              | object   | Voir ci-dessous          | Liste les options ci-dessous                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix       | string   | 'spinner'                | Préfix de classe                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;wrapper      | string   | '{prefix}-wrapper'       | Classe pour le wrapper du spinner                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;wrapperInner | string   | '{prefix}-wrapper-inner' | Classe pour le inner du wrapper                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;text         | string   | '{prefix}-text'          | Classe pour le texte du spinner                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;spinner      | string   | 'l-spinner'              | Classe pour indiquer si l'image spinner est activé                    |
| &nbsp;&nbsp;&nbsp;&nbsp;loading      | string   | 'is-loading'             | Classe pour indiquer si le spinner est en train de charger            |
| beforeWrap                           | function | undefined                | Callback avant l'ajout des wrappers dans le DOM                       |
| onShow                               | function | undefined                | Callback une fois le spinner affiché                                  |
| onHide                               | function | undefined                | Callback une fois le spinner masqué                                   |

## Méthodes

| Méthode      | Arguments                                                    | Description                                                      |
|--------------|--------------------------------------------------------------|------------------------------------------------------------------|
| setOptions   | **options** *object* Liste des options à modifier            | Permet de définir de nouvelles options                           |
| setContainer | **container** *jQuery object* Conteneur                      | Défini un conteneur dans lequel sera affiché le spinner          |
| getContainer | -                                                            | Récupère le conteneneur courant                                  |
| init         | -                                                            | Initialisation du spinner                                        |
| auto         | -                                                            | Auto show/hide le spinner en fonction des requêtes XHR exécutées |
| destroy      | -                                                            | Détruit le spinner pour revenir à la normale                     |
| refresh      | -                                                            | Détruit puis initialise le spinner                               |
| show         | **complete** *function* Callback une fois l'action effectuée | Affiche le spinner                                               |
| hide         | **complete** *function* Callback une fois l'action effectuée | Masque le spinner                                                |


## Ajax

Si vous voulez afficher un loader lors des requêtes XHR, activez l'option *auto*

    var spinner = $('#container').spinner({
        auto: true
    });
    
Sauf pour certaines urls :

    var spinner = $('#container').spinner({
        auto: true,
        autoPathsExceptions: [
            '/system-path-no-spinner',
            'spinner=0'
        ]
    });