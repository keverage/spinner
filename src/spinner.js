(function ($) {
    'use strict';

    $.Spinner = function (element, options) {
        // Élements
        this.elements = {
            container: element
        };

        // Config
        $.extend(true, this.settings = {}, $.Spinner.defaults, options);

        // Variables
        this.timeout = {
            min: undefined,
            max: undefined
        };

        // Init
        if (this.prepareOptions()) {
            this.init();
        }

        return this;
    };

    $.Spinner.defaults = {
        auto: false,
        autoPathsExceptions: [],
        type: 'overlay',
        wrapper: true,
        spinner: true,
        text: null,
        minTimeout: 600,
        maxTimeout: 8000,
        classes: {
            prefix: 'spinner',
            wrapper: '{prefix}-wrapper',
            wrapperInner: '{prefix}-wrapper-inner',
            text: '{prefix}-text',
            spinner: 'l-spinner',
            loading: 'is-loading'
        },
        beforeWrap: undefined,
        onShow: undefined,
        onHide: undefined
    };

    $.Spinner.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return boolean
         */
        prepareOptions: function () {
            var self = this;

            // Classes
            $.each(self.settings.classes, function (key, value) {
                if (typeof value === 'string') {
                    self.settings.classes[key] = value.replace(/{prefix}/, self.settings.classes.prefix);
                }
            });

            // Attributs data-{classes.prefix}-*
            $.each(self.settings, function (name) {
                var dataAttrValue = self.getContainer().attr('data-' + self.settings.classes.prefix + '-' + name);

                if (dataAttrValue !== undefined && dataAttrValue.length) {
                    self.settings[name] = (name === 'spinner') ? !dataAttrValue : dataAttrValue;
                }
            });

            // Auto disable wrapper
            if (self.settings.type === 'button' && self.getContainer().is('input, img')) {
                self.settings.wrapper = false;
            }

            return true;
        },

        /**
         * Permet de définir de nouvelles options
         *
         * @param options (object) Liste des options à modifier
         */
        setOptions: function (options) {
            $.extend(true, this.settings, options);
            this.refresh();

            return this;
        },

        /**
         * Défini un conteneur dans lequel sera affiché le spinner
         *
         * @param container (jQuery object) Conteneur
         */
        setContainer: function (container) {
            this.elements.container = container;
        },

        /**
         * Récupère le conteneneur courant
         *
         * @return jQuery object
         */
        getContainer: function () {
            return this.elements.container;
        },

        /**
         * Initialisation
         */
        init: function () {
            // Si c'est pas déjà initialisé
            if (!this.getContainer().hasClass(this.settings.classes.prefix)) {
                this.getContainer().addClass(this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.settings.type + ' ' + (this.settings.spinner ? this.settings.classes.spinner : ''));

                // Wrapper
                this.elements.wrapper = $('<' + (this.settings.type === 'button' ? 'span' : 'div') + '>', {
                    'class': this.settings.classes.wrapper
                });
                if (this.settings.wrapper) {
                    this.wrap();
                }

                // Autoload
                if (this.settings.auto) {
                    this.auto();
                }
            }

            return this;
        },

        /**
         * Auto show/hide le spinner en fonction des requêtes XHR exécutées
         */
        auto: function () {
            var self = this;

            $(document)
                .ajaxSend(function (event, jqXHR, ajaxOptions) {
                    var toShow = true;

                    if (self.settings.autoPathsExceptions.length) {
                        $.each(self.settings.autoPathsExceptions, function (i, path) {
                            if (ajaxOptions.url.indexOf(path) !== -1) {
                                toShow = false;
                            }
                        });
                    }

                    if (toShow) {
                        self.show();
                    }
                })
                .ajaxStop(function () {
                    self.hide();
                });

            return self;
        },

        /**
         * Détruit le spinner pour revenir à la normale
         */
        destroy: function () {
            var self = this;

            // Container
            self.getContainer().removeClass(function () {
                var classes = self.getContainer().attr('class').split(' ');
                var list = null;

                if (classes.length) {
                    $.each(classes, function (i, className) {
                        if (className.indexOf(self.settings.classes.prefix) !== -1) {
                            list += ' ' + className;
                        }
                    });
                }

                if (list !== null) {
                    return list.trim();
                }
            });

            if (self.getContainer().attr('class').length === 0) {
                self.getContainer().removeAttr('class');
            }

            // Wrapper
            self.elements.wrapper.remove();

            return self;
        },

        /**
         * Détruit puis initialise le spinner
         */
        refresh: function () {
            return this.destroy().init();
        },

        /**
         * Gestion des wrappers
         */
        wrap: function () {
            // Vide le wrapper pour le regenérer
            this.elements.wrapper.empty();

            // Inner
            this.elements.wrapperInner = $('<' + (this.settings.type === 'button' ? 'span' : 'div') + '>', {
                'class': this.settings.classes.wrapperInner
            });

            // Texte
            if (this.settings.text !== null && this.settings.type !== 'button') {
                this.elements.text = $('<p>', {
                    'class': this.settings.classes.text,
                    html: this.settings.text
                });
            }

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    spinner: this,
                    elements: this.elements
                });
            }

            // Insertion
            this.elements.wrapper[(this.settings.type === 'overlay') ? 'appendTo' : 'prependTo'](this.getContainer());
            this.elements.wrapperInner.appendTo(this.elements.wrapper);
            if (this.elements.text !== undefined) {
                this.elements.text.appendTo(this.elements.wrapperInner);
            }

            return this;
        },

        /**
         * Affiche le spinner
         *
         * @param complete (function) Fonction executée une fois le spinner affiché
         */
        show: function (complete) {
            this.getContainer().addClass(this.settings.classes.loading);

            // Le contenu de l'élement est remplacé par le paramètre "text"
            if (this.settings.type === 'button' && this.settings.text !== null) {
                this.elements.wrapper.remove();
                this.elements.buttontext = this.getContainer().html();
                this.getContainer().text(this.settings.text);
                if (this.settings.wrapper) {
                    this.wrap();
                }
            }

            // User callback
            if (this.settings.onShow !== undefined) {
                this.settings.onShow.call({
                    spinner: this,
                    container: this.getContainer()
                });
            }

            // Callback
            if (complete !== undefined) {
                complete.call({
                    spinner: this,
                    container: this.getContainer()
                });
            }

            // Timeout
            this.addTimeout();

            return this;
        },

        /**
         * Masque le spinner
         *
         * @param complete (function) Fonction executée une fois le spinner masqué
         */
        hide: function (complete) {
            var self = this;
            clearTimeout(self.timeout.min);
            clearTimeout(self.timeout.max);

            // Minimum timeout
            self.timeout.min = setTimeout(function () {
                self.getContainer().removeClass(self.settings.classes.loading);

                // Le contenu de l'élement est remis à l'état initial
                if (self.settings.type === 'button' && self.settings.text !== null && self.elements.buttontext !== undefined) {
                    self.getContainer().html(self.elements.buttontext);
                    if (self.settings.wrapper) {
                        self.wrap();
                    }
                }

                // User callback
                if (self.settings.onHide !== undefined) {
                    self.settings.onHide.call({
                        spinner: self,
                        container: self.getContainer()
                    });
                }

                // Callback
                if (complete !== undefined) {
                    complete.call({
                        spinner: self,
                        container: self.getContainer()
                    });
                }
            }, self.settings.minTimeout);

            return this;
        },

        /**
         * Ajoute un timeout à l'affichage du spinner pour le masquer automatiquement
         */
        addTimeout: function () {
            var self = this;

            if (self.settings.maxTimeout !== undefined && self.settings.maxTimeout > 0) {
                self.timeout.max = setTimeout(function () {
                    self.hide();
                }, self.settings.maxTimeout);
            }
        }
    };

    $.fn.spinner = function (options) {
        return new $.Spinner($(this), options);
    };
})(jQuery);