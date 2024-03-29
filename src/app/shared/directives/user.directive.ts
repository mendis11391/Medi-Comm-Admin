import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';

@Directive({ selector: '[appUser]'})
export class UserDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private authService: AuthService,
        private viewContainer: ViewContainerRef
    ) { }

    ngOnInit() {
        const hasAccess = this.authService.authenticatedCheck();

        if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
