(function ($) {
    'use strict';

    $.Spinner = function (element, options) {
        // Élements
        this.elements = {
            container: element
        };

        // Config
        $.extend(true, (this.settings = {}), $.Spinner.defaults, options);

        // Variables
        this.timeout = null;

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
         * @return bool
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
                var dataAttrValue = self.elements.container.attr('data-' + self.settings.classes.prefix + '-' + name);

                if (dataAttrValue !== undefined && dataAttrValue.length) {
                    self.settings[name] = (name === 'spinner') ? !dataAttrValue : dataAttrValue;
                }
            });

            return true;
        },

        /**
         * Permet de définir de nouvelles options
         *
         * @param object options Liste des options à modifier
         */
        setOptions: function (options) {
            $.extend(true, this.settings, options);
            this.refresh();

            return this;
        },

        /**
         * Initialisation
         */
        init: function () {
            // Si c'est pas déjà initialisé
            if (!this.elements.container.hasClass(this.settings.classes.prefix)) {
                this.elements.container.addClass(this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.settings.type + ' ' + ((this.settings.spinner === true) ? this.settings.classes.spinner : ''));

                // Wrapper
                this.elements.wrapper = $('<' + ((this.settings.type === 'button') ? 'span' : 'div') + '>', {
                    'class': this.settings.classes.wrapper
                });
                this.wrap();

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
            self.elements.container.removeClass(function () {
                var classes = self.elements.container.attr('class').split(' ');
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

            if (self.elements.container.attr('class').length === 0) {
                self.elements.container.removeAttr('class');
            }

            // Wrapper
            self.elements.wrapper.remove();

            return self;
        },

        /**
         * Détruit puis initialise le spinner
         */
        refresh: function () {
            this.destroy();
            this.init();

            return this;
        },

        /**
         * Gestion des wrappers
         */
        wrap: function () {
            // Vide le wrapper pour le regenérer
            this.elements.wrapper.empty();

            // Inner
            this.elements.wrapperInner = $('<div>', {
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
            this.elements.wrapper[(this.settings.type === 'overlay') ? 'appendTo' : 'prependTo'](this.elements.container);
            this.elements.wrapperInner.appendTo(this.elements.wrapper);
            if (this.elements.text !== undefined) {
                this.elements.text.appendTo(this.elements.wrapperInner);
            }

            return this;
        },

        /**
         * Affiche le spinner
         *
         * @param function complete Fonction executée une fois le spinner
         *     affiché
         */
        show: function (complete) {
            this.elements.container.addClass(this.settings.classes.loading);

            // Le contenu de l'élement est remplacé par le paramètre "text"
            if (this.settings.type === 'button' && this.settings.text !== null) {
                this.elements.wrapper.remove();
                this.elements.buttontext = this.elements.container.html();
                this.elements.container.text(this.settings.text);
                this.wrap();
            }

            // User callback
            if (this.settings.onShow !== undefined) {
                this.settings.onShow.call({
                    spinner: this,
                    container: this.elements.container
                });
            }

            // Callback
            if (complete !== undefined) {
                complete.call({
                    spinner: this,
                    container: this.elements.container
                });
            }

            // Timeout
            this.setTimeout();

            return this;
        },

        /**
         * Masque le spinner
         *
         * @param function complete Fonction executée une fois le spinner masqué
         */
        hide: function (complete) {
            var self = this;
            clearTimeout(self.timeout);

            // Minimum timeout
            setTimeout(function () {
                self.elements.container.removeClass(self.settings.classes.loading);

                // Le contenu de l'élement est remis à l'état initial
                if (self.settings.type === 'button' && self.settings.text !== null && self.elements.buttontext !== undefined) {
                    self.elements.container.html(self.elements.buttontext);
                    self.wrap();
                }

                // User callback
                if (self.settings.onHide !== undefined) {
                    self.settings.onHide.call({
                        spinner: self,
                        container: self.elements.container
                    });
                }

                // Callback
                if (complete !== undefined) {
                    complete.call({
                        spinner: self,
                        container: self.elements.container
                    });
                }
            }, self.settings.minTimeout);

            return this;
        },

        /**
         * Ajoute un timeout à l'affichage du spinner pour le masquer
         * automatiquement
         */
        setTimeout: function () {
            var self = this;

            if (self.settings.maxTimeout !== undefined && self.settings.maxTimeout > 0) {
                self.timeout = setTimeout(function () {
                    self.hide();
                }, self.settings.maxTimeout);
            }
        }
    };

    $.fn.spinner = function (options) {
        return new $.Spinner($(this), options);
    };
})(jQuery);