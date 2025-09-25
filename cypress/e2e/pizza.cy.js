const APP_URL =
  Cypress.config("baseUrl") ||
  Cypress.env("APP_URL") ||
  "http://localhost:5173";

const goHome = () => {
  cy.visit(APP_URL);
  cy.viewport(1280, 720);
};

const goOrderForm = () => {
  goHome();
  cy.contains("button", /^ACIKTIM$/).should("be.visible").click();
  cy.get("form.order-card").should("be.visible");
  cy.get("#name-input").should("exist");
  cy.get('input[name="size"]').should("have.length.at.least", 3);
  cy.get("#crust-select").should("exist");
};

const fillName = (text = "Ahmet Yılmaz") => {
  cy.get("#name-input").clear().type(text).should("have.value", text);
};

const chooseSize = (value = "medium") => {
  cy.get(`input[name="size"][value="${value}"]`)
    .check({ force: true })
    .should("be.checked");
};

const chooseCrust = (value = "normal") => {
  cy.get("#crust-select").select(value).should("have.value", value);
};

const selectToppingsByText = (labels = []) => {
  labels.forEach((label) => {
    cy.contains(".toppings-grid label", label)
      .find('input[type="checkbox"]')
      .check({ force: true })
      .should("be.checked");
  });
};

const submitButton = () =>
  cy.get('button[type="submit"]:visible').should("contain", "SİPARİŞ VER");

const expectTotal = (valueText) => {
  cy.get(".order-summary .price-details p.total")
    .find("span")
    .eq(1)
    .should(($s) => {
      expect($s.text().replace(/\s/g, "")).to.eq(valueText);
    });
};

const expectSelections = (valueText) => {
  cy.contains(".order-summary .price-details p", "Seçimler")
    .find("span")
    .eq(1)
    .should(($s) => {
      expect($s.text().replace(/\s/g, "")).to.eq(valueText);
    });
};

const setBaseOrder = () => {
  fillName("Ali Veli");
  chooseSize("small");     
  chooseCrust("thin");      
  selectToppingsByText(["Pepperoni", "Domates", "Biber", "Mısır"]); 

};

describe("Teknolojik Yemekler - Pizza Sipariş Akışı", () => {
  beforeEach(() => {
    Cypress.on("uncaught:exception", (err) => {
      if (/ResizeObserver loop limit exceeded/i.test(err.message)) return false;
      return undefined;
    });
  });


  it("İsim inputuna metin girer", () => {
    goOrderForm();
    fillName("Fatma Nur");
  });


  it("Birden fazla malzeme seçilebilir", () => {
    goOrderForm();
    selectToppingsByText(["Pepperoni", "Domates", "Biber", "Mısır"]);
    cy.get('.toppings-grid input[type="checkbox"]:checked').should(
      "have.length.at.least",
      4
    );
  });

 
  it("Validasyon hataları boş gönderimde görünür", () => {
    goOrderForm();
    submitButton().click();

    cy.get('[data-cy="error-size"]').should("be.visible").and("contain", "Pizza boyutunu seçmelisiniz");
    cy.get('[data-cy="error-crust"]').should("be.visible").and("contain", "Hamur kalınlığını seçmelisiniz");
    cy.get('[data-cy="error-toppings"]').should("be.visible").and("contain", "En az 4 malzeme seçmelisiniz");
    cy.get('[data-cy="error-name"]').should("be.visible").and("contain", "İsim en az 3 karakter olmalıdır");
  });

 
  it("Toplam fiyat boyut seçimine göre güncellenir", () => {
    goOrderForm();
    expectTotal("85.50₺");   
    chooseSize("large");
    expectTotal("105.50₺");
  });


  it("En fazla 10 malzeme sınırı: 11. seçim engellenir", () => {
    goOrderForm();
    cy.get('.toppings-grid input[type="checkbox"]').should("have.length.at.least", 11);
    cy.get('.toppings-grid input[type="checkbox"]').each(($chk, idx) => {
      if (idx < 10) cy.wrap($chk).check({ force: true }).should("be.checked");
    });
    cy.get('.toppings-grid input[type="checkbox"]').eq(10).should("be.disabled");
  });


  it("Form başarıyla gönderilir ve başarı sayfası görüntülenir", () => {
    goOrderForm();

    fillName("Ahmet Yılmaz");
    chooseSize("medium");
    chooseCrust("normal");
    selectToppingsByText(["Pepperoni", "Domates", "Biber", "Mısır"]);

    cy.intercept("POST", "**/api/pizza", {
      statusCode: 201,
      body: { id: "order_abc123", createdAt: new Date().toISOString() },
    }).as("postOrder");

    cy.clock();
    submitButton().click();
    cy.wait("@postOrder").its("response.statusCode").should("eq", 201);

    cy.get(".loading-overlay .loading-text").should("contain", "Siparişiniz gönderiliyor...");
    cy.tick(1000);
    cy.get(".loading-overlay .success-text").should("contain", "Gönderildi!");
    cy.get(".loading-overlay .success-subtext").should("contain", "Yönlendiriliyorsunuz…");
    cy.tick(1000);

    cy.contains(".success-title", "SİPARİŞ ALINDI").should("be.visible");
    cy.contains(".summary-title", "Sipariş Toplamı").should("be.visible");
    cy.contains(".order-specs .spec-label", "Boyut:").siblings(".spec-value").should("not.be.empty");
    cy.contains(".order-specs .spec-label", "Hamur:").siblings(".spec-value").should("not.be.empty");
  });


  it("Home ürün kartından form sayfasına geçiş", () => {
    goHome();
    cy.contains(".product-card .product-name", "Terminal Pizza")
      .closest(".product-card")
      .click();
    cy.get("form.order-card").should("be.visible");
    cy.get(".product-title").should("be.visible");
  });


  it("Header logosu Order sayfasından Anasayfa'ya döndürür", () => {
    goOrderForm();
    cy.get(".main-header .site-logo").should("be.visible").click();
    cy.get(".hero-section").should("be.visible");
    cy.contains("button", /^ACIKTIM$/).should("be.visible");
  });


  it("Footer içeriği doğru render edilir (iletişim + Instagram grid)", () => {
    goOrderForm();
    cy.get("footer.footer").should("be.visible");
    cy.get(".contact-info").within(() => {
      cy.contains("İstanbul Türkiye");
      cy.contains("aciktim@teknolojikyemekler.com");
      cy.contains("+90 216 123 45 67");
    });
    cy.get(".social-grid .social-image").should("have.length", 6);
  });


  it("Adet arttıkça 'Seçimler' ve 'Toplam' doğru güncellenir", () => {
    goOrderForm();
    setBaseOrder(); 

    expectSelections("20.00₺");
    expectTotal("85.50₺");
    cy.get(".actions-row > .quantity-selector").find("button").eq(1).click(); 
    expectSelections("40.00₺");
    expectTotal("171.00₺");

    cy.get(".actions-row > .quantity-selector").find("button").eq(0).click(); 
    expectSelections("20.00₺");
    expectTotal("85.50₺");
  });

  it("Hatalar düzeltildikçe kaybolur (happy path)", () => {
    goOrderForm();
    submitButton().click();

    chooseSize("medium");
    cy.get('[data-cy="error-size"]').should("not.exist");

    chooseCrust("normal");
    cy.get('[data-cy="error-crust"]').should("not.exist");

    selectToppingsByText(["Pepperoni", "Domates", "Biber", "Mısır"]);
    cy.get('[data-cy="error-toppings"]').should("not.exist");

    cy.get("#name-input").clear().type("Al").blur();
    cy.get('[data-cy="error-name"]').should("contain", "İsim en az 3 karakter olmalıdır");
    cy.get("#name-input").type("i").blur(); 
    cy.get('[data-cy="error-name"]').should("not.exist");
  });


  it("Mobil görünümde mobil submit görünür, desktop submit gizli", () => {
    goOrderForm();
    cy.viewport(390, 844);

    cy.get(".submit-button-mobile").should("be.visible");
    cy.get(".order-summary .submit-button").should("not.be.visible");
    cy.get(".quantity-selector-container .quantity-selector").should("be.visible");
  });


  it("Breadcrumb 'Anasayfa' bağlantısı Home'a döndürür", () => {
    goOrderForm();
    cy.get(".breadcrumb-section .breadcrumb-link").contains("Anasayfa").click();
    cy.get(".hero-section").should("be.visible");
    cy.contains("button", /^ACIKTIM$/).should("be.visible");
  });


  it("Radio grup seçimi tekil kalır (exclusive)", () => {
    goOrderForm();
    chooseSize("small");
    cy.get('input[name="size"][value="small"]').should("be.checked");

    chooseSize("large");
    cy.get('input[name="size"][value="large"]').should("be.checked");
    cy.get('input[name="size"][value="small"]').should("not.be.checked");
  });

  
  it("Desktop görünümünde desktop quantity görünür, mobil container gizli", () => {
    goOrderForm();
    cy.viewport(1280, 720);

    cy.get(".actions-row > .quantity-selector").should("be.visible");
    cy.get(".quantity-selector-container").should("not.be.visible");
    cy.get(".order-summary .submit-button").should("be.visible");
  });


  it("Adet 1'in altına düşmez, azalt butonu 1'de disabled", () => {
    goOrderForm();
    cy.get(".actions-row > .quantity-selector").as("qty");
    cy.get("@qty").find("span").should("contain", "1");
    cy.get("@qty").find("button").eq(0).should("be.disabled"); 
    cy.get("@qty").find("button").eq(1).click(); 
    cy.get("@qty").find("span").should("contain", "2");
    cy.get("@qty").find("button").eq(0).should("not.be.disabled").click(); 
    cy.get("@qty").find("span").should("contain", "1");
    cy.get("@qty").find("button").eq(0).should("be.disabled");
  });


  it("10 seçili olduğunda kalan checkbox label'ları 'disabled' sınıfı alır", () => {
    goOrderForm();
    cy.get('.toppings-grid input[type="checkbox"]').should("have.length.at.least", 11);

    cy.get('.toppings-grid input[type="checkbox"]').each(($chk, idx) => {
      if (idx < 10) cy.wrap($chk).check({ force: true });
    });

  
    cy.get('.toppings-grid input[type="checkbox"]').eq(10)
      .should("be.disabled")
      .parents("label.checkbox-label")
      .should("have.class", "disabled");
  });

  it("Fiyat hesabı: Large + 6 topping + adet 3 → Seçimler 90.00₺, Toplam 406.50₺", () => {
    goOrderForm();
    fillName("Test Kullanıcı");
    chooseSize("large"); 
    chooseCrust("normal");


    cy.get('.toppings-grid input[type="checkbox"]').then(($inputs) => {
      for (let i = 0; i < 6; i++) {
        cy.wrap($inputs[i]).check({ force: true });
      }
    });


    cy.get(".actions-row > .quantity-selector").find("button").eq(1).click().click(); 
    expectSelections("90.00₺");  
    expectTotal("406.50₺");     
  });


  it("Başarı sayfasında ürün adı fallback olarak 'Position Absolute Acı Pizza' gösterilir", () => {
    goOrderForm(); 

    fillName("Ayşe Kaya");
    chooseSize("small");
    chooseCrust("thin");
    selectToppingsByText(["Pepperoni", "Domates", "Biber", "Mısır"]);

    cy.intercept("POST", "**/api/pizza", {
      statusCode: 201,
      body: { id: "order_xyz", createdAt: new Date().toISOString() },
    }).as("postOrder2");

    cy.clock();
    submitButton().click();
    cy.wait("@postOrder2");

    cy.tick(1000); 
    cy.tick(1000); 

    cy.get(".order-item-name")
      .should("be.visible")
      .and("contain", "Position Absolute Acı Pizza");
  });


  it("Home: kategori navigasyonu ve sekmeler doğru (Pizza aktif)", () => {
    goHome();
    cy.get(".nav-menu .nav-item").should("have.length", 6);
    cy.get(".category-tabs .tab").should("have.length", 6);
    cy.get(".category-tabs .tab.active").should("contain.text", "Pizza");
  });
});
